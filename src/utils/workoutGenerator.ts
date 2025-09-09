import { supabase } from "@/integrations/supabase/client";

export interface WorkoutGenerationParams {
  trainingExperience: "beginner" | "intermediate" | "advanced";
  trainingGoals: string[]; // optional extra goals
  weeklyAvailability: number; // 1-7
  availableEquipment: string[]; // e.g., ["bodyweight","dumbbells","barbell"]
  dislikedExercises: string[]; // exercise IDs
  preferredDuration: number; // minutes
  trainingFocus: "strength" | "hypertrophy" | "endurance" | "general_fitness";
}

export interface GeneratedWorkout {
  name: string;
  warmup?: Array<Slot>;
  exercises: Array<Slot>;
  cooldown?: Array<Slot>;
  estimated_duration: number; // minutes
  session_type: string;
}

export type Slot = {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number | string;
  weight_kg?: number;
  rest_seconds: number;
  order_index: number;
  notes?: string;
  movement_pattern: string;
  muscle_groups: string[];
  priority?: 1 | 2; // 1 = primary compound, 2 = secondary/accessory
};

// ------------------ utils ------------------
function weekSeed() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.floor(((d as any) - (onejan as any)) / 604800000);
  return `${d.getFullYear()}-w${week}`;
}
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededPick<T>(arr: T[], rand: () => number) {
  if (!arr.length) return undefined as any;
  return arr[Math.floor(rand() * arr.length)];
}

// Movement pattern caps used for weekly fatigue management
const PRIMARY_PATTERNS = [
  "squat",
  "hinge",
  "push_vertical",
  "push_horizontal",
  "pull_vertical",
  "pull_horizontal",
  "lunge",
];

function weeklyTargets(focus: string, exp: string, availability: number) {
  // rough per-pattern weekly "hard sets" targets
  const base: Record<string, { primary: number; accessory: number }> = {
    strength: { primary: 10, accessory: 6 },
    hypertrophy: { primary: 12, accessory: 10 },
    endurance: { primary: 8, accessory: 6 },
    general_fitness: { primary: 10, accessory: 8 },
  };
  const expMod: Record<string, number> = { beginner: -2, intermediate: 0, advanced: +2 };
  const p = base[focus] || base.general_fitness;
  const mod = expMod[exp] || 0;
  // fewer days -> slightly higher per-day load
  const availMod = availability <= 3 ? +1 : availability >= 5 ? -1 : 0;
  const primary = Math.max(4, p.primary + mod + availMod);
  const accessory = Math.max(2, p.accessory + mod);
  const caps: Record<string, number> = {};
  for (const pat of PRIMARY_PATTERNS) caps[pat] = primary;
  caps["isolation"] = accessory * 2; // pooled accessory bucket
  return caps;
}

function repsScheme(focus: string, exp: string) {
  const base: any = {
    beginner: { compound: { sets: 3, reps: "8-10" }, isolation: { sets: 2, reps: "12-15" } },
    intermediate: { compound: { sets: 4, reps: "6-8" }, isolation: { sets: 3, reps: "10-12" } },
    advanced: { compound: { sets: 5, reps: "4-6" }, isolation: { sets: 3, reps: "8-12" } },
  };
  const reps: any = {
    strength: { compound: "3-5", isolation: "6-8" },
    hypertrophy: { compound: "6-12", isolation: "10-15" },
    endurance: { compound: "12-20", isolation: "15-25" },
    general_fitness: { compound: "8-12", isolation: "10-15" },
  };
  const b = base[exp];
  const r = reps[focus] || reps.general_fitness;
  return {
    compoundSets: b.compound.sets,
    compoundReps: r.compound,
    isoSets: b.isolation.sets,
    isoReps: r.isolation,
  };
}

function restSeconds(priority: 1 | 2, focus: string) {
  const base: any = {
    strength: { 1: 180, 2: 120 },
    hypertrophy: { 1: 90, 2: 60 },
    endurance: { 1: 60, 2: 45 },
    general_fitness: { 1: 90, 2: 60 },
  };
  return (base[focus] || base.general_fitness)[priority];
}

function estimateMinutes(sets: number, rest: number) {
  // ~45s effort per set + rest
  return Math.ceil((sets * (45 + rest)) / 60);
}

export class WorkoutGenerator {
  private exercises: any[] = [];

  async initialize() {
    const { data, error } = await supabase.from("exercises").select("*");
    if (error) throw error;
    this.exercises = data || [];
  }

  async generateProgram(params: WorkoutGenerationParams): Promise<GeneratedWorkout[]> {
    if (!this.exercises.length) await this.initialize();

    const type = this.determineProgramType(params);
    const caps = weeklyTargets(params.trainingFocus, params.trainingExperience, params.weeklyAvailability);
    const days = Math.max(1, Math.min(7, params.weeklyAvailability));

    const seedStr = JSON.stringify({
      focus: params.trainingFocus,
      exp: params.trainingExperience,
      avail: params.weeklyAvailability,
      equip: params.availableEquipment,
      dislike: params.dislikedExercises,
      week: weekSeed(),
    });
    const seed = xmur3(seedStr)();
    const rand = mulberry32(seed);

    const workouts: GeneratedWorkout[] = [];

    for (let day = 0; day < days; day++) {
      const template = this.dayTemplate(type, params, day);
      const { exercises, sessionType } = this.populate(template, params, caps, rand);

      // time-box to preferred duration
      const trimmed = this.timeBox(exercises, params.preferredDuration, params.trainingFocus);
      const duration = trimmed.reduce((min, s) => min + estimateMinutes(s.sets, s.rest_seconds), 0);

      // warm-up / cooldown simple scaffolding: 6–10 min total if room
      const warmOk = Math.max(0, params.preferredDuration - duration) >= 6;
      const coolOk = Math.max(0, params.preferredDuration - duration - (warmOk ? 6 : 0)) >= 4;
      const warm = warmOk ? await this.generateWarmup(trimmed, 6) : undefined;
      const cool = coolOk ? await this.generateCooldown(trimmed, 4) : undefined;

      workouts.push({
        name: `${this.titleFor(type, day)} ${Math.floor(day / this.cycleLen(type)) + 1}`.trim(),
        exercises: trimmed,
        warmup: warm,
        cooldown: cool,
        estimated_duration: duration + (warmOk ? 6 : 0) + (coolOk ? 4 : 0),
        session_type: sessionType,
      });
    }

    return workouts;
  }

  private determineProgramType(p: WorkoutGenerationParams) {
    if (p.weeklyAvailability <= 3) return "full_body";
    if (p.weeklyAvailability === 4) return "upper_lower";
    return "push_pull_legs";
  }

  private cycleLen(type: string) {
    return type === "push_pull_legs" ? 3 : type === "upper_lower" ? 2 : 1;
  }

  private titleFor(type: string, day: number) {
    if (type === "push_pull_legs") return ["Push", "Pull", "Legs"][day % 3];
    if (type === "upper_lower") return day % 2 === 0 ? "Upper" : "Lower";
    return "Full Body";
  }

  private dayTemplate(type: string, p: WorkoutGenerationParams, day: number) {
    const sch = repsScheme(p.trainingFocus, p.trainingExperience);
    const core = [
      { pattern: "squat", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "hinge", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "push_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "pull_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "push_vertical", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
      { pattern: "pull_vertical", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
    ];

    if (type === "full_body") return core.slice(0, 4).concat([{ pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const }]);

    if (type === "upper_lower") {
      const upper = [
        { pattern: "push_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "pull_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "push_vertical", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "pull_vertical", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
      ];
      const lower = [
        { pattern: "squat", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "hinge", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "lunge", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
        { pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
      ];
      return day % 2 === 0 ? upper : lower;
    }

    // push/pull/legs
    const push = [
      { pattern: "push_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "push_vertical", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
    ];
    const pull = [
      { pattern: "pull_horizontal", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "pull_vertical", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
    ];
    const legs = [
      { pattern: "squat", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "hinge", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "lunge", sets: sch.compoundSets, reps: sch.compoundReps, priority: 1 as const },
      { pattern: "isolation", sets: sch.isoSets, reps: sch.isoReps, priority: 2 as const },
    ];
    return [push, pull, legs][day % 3];
  }

  private populate(template: any[], p: WorkoutGenerationParams, caps: Record<string, number>, rand: () => number) {
    const out: Slot[] = [];
    for (let i = 0; i < template.length; i++) {
      const slot = template[i];
      const ex = this.selectExerciseForPattern(slot.pattern, p, out);
      if (!ex) continue;
      const capLeft = caps[slot.pattern] ?? caps["isolation"] ?? 0;
      if (capLeft <= 0) continue;
      const sets = Math.max(1, Math.min(slot.sets, capLeft));
      const rest = restSeconds(slot.priority, p.trainingFocus);
      out.push({
        exercise_id: ex.id,
        exercise_name: ex.name,
        sets,
        reps: slot.reps,
        rest_seconds: rest,
        order_index: out.length,
        movement_pattern: ex.movement_pattern,
        muscle_groups: ex.muscle_groups,
        notes: ex.instructions?.substring(0, 100),
        priority: slot.priority,
      });
      caps[slot.pattern] = capLeft - sets;
    }

    const sessionType = this.determineSessionType(template);
    return { exercises: out, sessionType };
  }

  private timeBox(exs: Slot[], targetMin: number, focus: string) {
    const copy = exs.map(e => ({ ...e }));
    const maxMin = Math.max(15, targetMin || 45);

    const total = () => copy.reduce((m, s) => m + estimateMinutes(s.sets, s.rest_seconds), 0);

    // 1) Trim accessory sets first
    let minutes = total();
    for (let i = copy.length - 1; i >= 0 && minutes > maxMin; i--) {
      if ((copy[i].priority || 2) === 2 && copy[i].sets > 1) {
        copy[i].sets -= 1;
        minutes = total();
      }
    }
    // 2) Drop last accessory exercises if still over
    for (let i = copy.length - 1; i >= 0 && minutes > maxMin; i--) {
      if ((copy[i].priority || 2) === 2) {
        copy.splice(i, 1);
        minutes = total();
      }
    }
    // 3) If still over, reduce secondary rest times a bit for endurance/general
    if (minutes > maxMin && (focus === "endurance" || focus === "general_fitness")) {
      for (const s of copy) if ((s.priority || 2) === 2) s.rest_seconds = Math.max(30, Math.round(s.rest_seconds * 0.75));
      minutes = total();
    }
    return copy;
  }

  private determineSessionType(template: any[]): string {
    const patterns = template.map((t: any) => t.pattern);
    if (patterns.includes("squat") && patterns.includes("hinge") && patterns.includes("push_horizontal")) return "full_body";
    if (patterns.includes("push_horizontal") && patterns.includes("push_vertical")) return "push";
    if (patterns.includes("pull_horizontal") && patterns.includes("pull_vertical")) return "pull";
    if (patterns.includes("squat") && patterns.includes("hinge")) return "legs";
    return "mixed";
  }

  private selectExerciseForPattern(pattern: string, p: WorkoutGenerationParams, already: Slot[]) {
    const expList = ["beginner", "intermediate", "advanced"];
    const allowedExp = expList.slice(0, expList.indexOf(p.trainingExperience) + 1);

    // strict filter
    let candidates = this.exercises.filter((ex) => {
      if (ex.movement_pattern !== pattern) return false;
      if (!allowedExp.includes(ex.experience_level)) return false;
      if (ex.equipment && !p.availableEquipment.includes(ex.equipment)) return false;
      if (p.dislikedExercises.includes(ex.id)) return false;
      if (already.some((s) => s.exercise_id === ex.id)) return false;
      return true;
    });

    // relax equipment to allow bodyweight
    if (!candidates.length) {
      candidates = this.exercises.filter((ex) => {
        if (ex.movement_pattern !== pattern) return false;
        if (already.some((s) => s.exercise_id === ex.id)) return false;
        if (p.dislikedExercises.includes(ex.id)) return false;
        if (ex.equipment && ex.equipment !== "bodyweight" && !p.availableEquipment.includes(ex.equipment)) return false;
        return true;
      });
    }

    // try similar patterns
    if (!candidates.length) {
      for (const alt of this.getSimilarPatterns(pattern)) {
        candidates = this.exercises.filter((ex) => {
          if (ex.movement_pattern !== alt) return false;
          if (already.some((s) => s.exercise_id === ex.id)) return false;
          if (p.dislikedExercises.includes(ex.id)) return false;
          if (ex.equipment && ex.equipment !== "bodyweight" && !p.availableEquipment.includes(ex.equipment)) return false;
          return true;
        });
        if (candidates.length) break;
      }
    }

    if (!candidates.length) return null;

    // prefer compound
    const compounds = candidates.filter((c: any) => c.is_compound);
    const pool = compounds.length ? compounds : candidates;
    // seeded pick for deterministic variation per user/week
    const seed = xmur3(JSON.stringify({ pattern, equip: p.availableEquipment, dislike: p.dislikedExercises, week: weekSeed() }))();
    const rand = mulberry32(seed);
    return seededPick(pool, rand);
  }

  private getSimilarPatterns(pattern: string): string[] {
    const map: Record<string, string[]> = {
      push_vertical: ["push_horizontal", "isolation"],
      push_horizontal: ["push_vertical", "isolation"],
      pull_vertical: ["pull_horizontal", "isolation"],
      pull_horizontal: ["pull_vertical", "isolation"],
      squat: ["lunge", "hinge"],
      hinge: ["squat", "lunge"],
      lunge: ["squat", "hinge"],
      isolation: ["carry", "rotation"],
      carry: ["isolation"],
      rotation: ["isolation"],
    };
    return map[pattern] || ["isolation"];
  }

  private async generateWarmup(main: Slot[], minutes: number) {
    const target = Math.max(3, Math.min(6, Math.floor(minutes / 1.5)));
    const groups = this.extractMuscles(main).slice(0, 4);
    const pool = this.exercises.filter((e) => e.category === "warm_up");
    const picks: Slot[] = [];
    for (const g of groups) {
      const match = pool.filter((e) => e.muscle_groups?.includes(g) && !picks.find((s) => s.exercise_id === e.id));
      if (match.length) {
        const ex = match[Math.floor(Math.random() * match.length)];
        picks.push({
          exercise_id: ex.id,
          exercise_name: ex.name,
          sets: 1,
          reps: ex.name.includes("Hold") ? 30 : 10,
          rest_seconds: 15,
          order_index: picks.length,
          movement_pattern: ex.movement_pattern,
          muscle_groups: ex.muscle_groups || [],
        });
      }
    }
    return picks.slice(0, target);
  }

  private async generateCooldown(main: Slot[], minutes: number) {
    const target = Math.max(3, Math.min(6, Math.floor(minutes / 1.5)));
    const groups = this.extractMuscles(main).slice(0, 4);
    const pool = this.exercises.filter((e) => e.category === "cool_down");
    const picks: Slot[] = [];
    for (const g of groups) {
      const match = pool.filter((e) => e.muscle_groups?.includes(g) && !picks.find((s) => s.exercise_id === e.id));
      if (match.length) {
        const ex = match[Math.floor(Math.random() * match.length)];
        picks.push({
          exercise_id: ex.id,
          exercise_name: ex.name,
          sets: 1,
          reps: 30,
          rest_seconds: 10,
          order_index: picks.length,
          movement_pattern: ex.movement_pattern,
          muscle_groups: ex.muscle_groups || [],
        });
      }
    }
    return picks.slice(0, target);
  }

  private extractMuscles(exs: Slot[]) {
    const s = new Set<string>();
    exs.forEach((e) => (e.muscle_groups || []).forEach((m) => s.add(m)));
    return Array.from(s);
  }

  async findExerciseAlternative(exerciseId: string, params: WorkoutGenerationParams) {
    const { data: alts } = await supabase
      .from("exercise_alternatives")
      .select("alternative_exercise_id")
      .eq("primary_exercise_id", exerciseId);

    if (alts?.length) {
      const ids = alts.map((a: any) => a.alternative_exercise_id);
      const { data: details } = await supabase.from("exercises").select("*").in("id", ids);
      const valid = (details || []).filter(
        (e: any) => !params.dislikedExercises.includes(e.id) && (!e.equipment || params.availableEquipment.includes(e.equipment))
      );
      if (valid.length) return valid[0];
    }

    const original = this.exercises.find((e) => e.id === exerciseId);
    if (!original) return null;
    return this.selectExerciseForPattern(original.movement_pattern, params, [{ exercise_id: exerciseId } as any]);
  }
}
