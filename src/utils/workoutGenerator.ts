import { supabase } from '@/integrations/supabase/client';

export interface WorkoutGenerationParams {
  trainingExperience: 'beginner' | 'intermediate' | 'advanced';
  trainingGoals: string[];
  weeklyAvailability: number;
  availableEquipment: string[];
  dislikedExercises: string[];
  preferredDuration: number;
  trainingFocus: 'strength' | 'hypertrophy' | 'endurance' | 'general_fitness';
}

export interface GeneratedWorkout {
  name: string;
  exercises: Array<{
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
  }>;
  estimated_duration: number;
  session_type: string;
}

// Movement patterns for balanced programming
const MOVEMENT_PATTERNS = {
  squat: ['squat', 'goblet_squat', 'front_squat', 'split_squat'],
  hinge: ['deadlift', 'rdl', 'good_morning', 'hip_thrust'],
  push_vertical: ['overhead_press', 'push_press', 'handstand_pushup'],
  push_horizontal: ['push_up', 'bench_press', 'chest_press'],
  pull_vertical: ['pull_up', 'lat_pulldown', 'chin_up'],
  pull_horizontal: ['row', 'reverse_fly', 'face_pull'],
  lunge: ['lunge', 'reverse_lunge', 'walking_lunge', 'curtsy_lunge'],
  carry: ['farmer_walk', 'suitcase_carry', 'overhead_carry'],
  rotation: ['wood_chop', 'russian_twist', 'pallof_press'],
  isolation: ['bicep_curl', 'tricep_extension', 'lateral_raise']
};

export class WorkoutGenerator {
  private exercises: any[] = [];

  async initialize() {
    const { data, error } = await supabase
      .from('exercises')
      .select('*');

    if (error) {
      console.error('Error fetching exercises:', error);
      return;
    }

    this.exercises = data || [];
  }

  async generateProgram(params: WorkoutGenerationParams): Promise<GeneratedWorkout[]> {
    if (this.exercises.length === 0) {
      await this.initialize();
    }

    const programType = this.determineProgramType(params);
    const workouts: GeneratedWorkout[] = [];

    switch (programType) {
      case 'full_body':
        workouts.push(...this.generateFullBodyProgram(params));
        break;
      case 'upper_lower':
        workouts.push(...this.generateUpperLowerProgram(params));
        break;
      case 'push_pull_legs':
        workouts.push(...this.generatePushPullLegsProgram(params));
        break;
      default:
        workouts.push(...this.generateFullBodyProgram(params));
    }

    return workouts;
  }

  private determineProgramType(params: WorkoutGenerationParams): string {
    if (params.weeklyAvailability <= 3) return 'full_body';
    if (params.weeklyAvailability === 4) return 'upper_lower';
    if (params.weeklyAvailability >= 5) return 'push_pull_legs';
    return 'full_body';
  }

  private generateFullBodyProgram(params: WorkoutGenerationParams): GeneratedWorkout[] {
    const workoutTemplate = this.createFullBodyTemplate(params);
    const workouts: GeneratedWorkout[] = [];

    for (let i = 0; i < params.weeklyAvailability; i++) {
      const workout = this.populateWorkoutWithExercises(
        `Full Body Workout ${i + 1}`,
        workoutTemplate,
        params
      );
      workouts.push(workout);
    }

    return workouts;
  }

  private generateUpperLowerProgram(params: WorkoutGenerationParams): GeneratedWorkout[] {
    const upperTemplate = this.createUpperBodyTemplate(params);
    const lowerTemplate = this.createLowerBodyTemplate(params);
    
    const workouts: GeneratedWorkout[] = [];
    
    // Alternate upper/lower
    for (let i = 0; i < params.weeklyAvailability; i++) {
      const isUpper = i % 2 === 0;
      const template = isUpper ? upperTemplate : lowerTemplate;
      const name = isUpper ? `Upper Body ${Math.floor(i/2) + 1}` : `Lower Body ${Math.floor(i/2) + 1}`;
      
      const workout = this.populateWorkoutWithExercises(name, template, params);
      workouts.push(workout);
    }

    return workouts;
  }

  private generatePushPullLegsProgram(params: WorkoutGenerationParams): GeneratedWorkout[] {
    const pushTemplate = this.createPushTemplate(params);
    const pullTemplate = this.createPullTemplate(params);
    const legsTemplate = this.createLegsTemplate(params);
    
    const templates = [pushTemplate, pullTemplate, legsTemplate];
    const names = ['Push', 'Pull', 'Legs'];
    const workouts: GeneratedWorkout[] = [];

    for (let i = 0; i < params.weeklyAvailability; i++) {
      const templateIndex = i % 3;
      const cycleNumber = Math.floor(i / 3) + 1;
      const name = `${names[templateIndex]} ${cycleNumber}`;
      
      const workout = this.populateWorkoutWithExercises(name, templates[templateIndex], params);
      workouts.push(workout);
    }

    return workouts;
  }

  private createFullBodyTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'squat', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'hinge', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'push_horizontal', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'pull_horizontal', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'push_vertical', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'pull_vertical', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private createUpperBodyTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'push_horizontal', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'pull_horizontal', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'push_vertical', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'pull_vertical', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private createLowerBodyTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'squat', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'hinge', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'lunge', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private createPushTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'push_horizontal', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'push_vertical', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private createPullTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'pull_vertical', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'pull_horizontal', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private createLegsTemplate(params: WorkoutGenerationParams) {
    const sets = this.getSetsRepsForGoal(params.trainingFocus, params.trainingExperience);
    
    return [
      { pattern: 'squat', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'hinge', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'lunge', sets: sets.compound.sets, reps: sets.compound.reps, priority: 1 },
      { pattern: 'isolation', sets: sets.isolation.sets, reps: sets.isolation.reps, priority: 2 }
    ];
  }

  private getSetsRepsForGoal(focus: string, experience: string) {
    const baseVolume = {
      beginner: { compound: { sets: 3, reps: '8-10' }, isolation: { sets: 2, reps: '12-15' } },
      intermediate: { compound: { sets: 4, reps: '6-8' }, isolation: { sets: 3, reps: '10-12' } },
      advanced: { compound: { sets: 5, reps: '5-6' }, isolation: { sets: 3, reps: '8-12' } }
    };

    const focusModifiers = {
      strength: { compoundReps: '3-5', isolationReps: '6-8' },
      hypertrophy: { compoundReps: '6-12', isolationReps: '8-15' },
      endurance: { compoundReps: '12-20', isolationReps: '15-25' },
      general_fitness: { compoundReps: '8-12', isolationReps: '10-15' }
    };

    const base = baseVolume[experience as keyof typeof baseVolume];
    const modifier = focusModifiers[focus as keyof typeof focusModifiers];

    return {
      compound: { sets: base.compound.sets, reps: modifier.compoundReps },
      isolation: { sets: base.isolation.sets, reps: modifier.isolationReps }
    };
  }

  private populateWorkoutWithExercises(
    name: string,
    template: any[],
    params: WorkoutGenerationParams
  ): GeneratedWorkout {
    const selectedExercises: any[] = [];
    let estimatedDuration = 10; // warm-up time

    template.forEach((slot, index) => {
      const exercise = this.selectExerciseForPattern(slot.pattern, params, selectedExercises);
      
      if (exercise) {
        const restTime = this.calculateRestTime(slot.priority, params.trainingFocus);
        
        selectedExercises.push({
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          sets: slot.sets,
          reps: slot.reps,
          rest_seconds: restTime,
          order_index: index,
          movement_pattern: exercise.movement_pattern,
          muscle_groups: exercise.muscle_groups,
          notes: exercise.instructions?.substring(0, 100)
        });

        // Estimate time: sets * (45 seconds execution + rest time)
        estimatedDuration += slot.sets * (45 + restTime) / 60;
      }
    });

    return {
      name,
      exercises: selectedExercises,
      estimated_duration: Math.round(estimatedDuration),
      session_type: this.determineSessionType(template)
    };
  }

  private selectExerciseForPattern(
    pattern: string,
    params: WorkoutGenerationParams,
    alreadySelected: any[]
  ) {
    const availableExercises = this.exercises.filter(exercise => {
      // Filter by movement pattern
      if (exercise.movement_pattern !== pattern) return false;
      
      // Filter by experience level
      const experienceLevels = ['beginner'];
      if (params.trainingExperience === 'intermediate') experienceLevels.push('intermediate');
      if (params.trainingExperience === 'advanced') experienceLevels.push('advanced');
      
      if (!experienceLevels.includes(exercise.experience_level)) return false;
      
      // Filter by available equipment
      if (exercise.equipment && !params.availableEquipment.includes(exercise.equipment)) return false;
      
      // Exclude disliked exercises
      if (params.dislikedExercises.includes(exercise.id)) return false;
      
      // Don't repeat exercises in same workout
      if (alreadySelected.some(selected => selected.exercise_id === exercise.id)) return false;
      
      return true;
    });

    // Prioritize compound movements
    const compoundExercises = availableExercises.filter(ex => ex.is_compound);
    const targetExercises = compoundExercises.length > 0 ? compoundExercises : availableExercises;

    // Return random exercise from available options
    return targetExercises[Math.floor(Math.random() * targetExercises.length)];
  }

  private calculateRestTime(priority: number, focus: string): number {
    const baseRest = {
      strength: { primary: 180, secondary: 120 },
      hypertrophy: { primary: 90, secondary: 60 },
      endurance: { primary: 60, secondary: 45 },
      general_fitness: { primary: 90, secondary: 60 }
    };

    const restTimes = baseRest[focus as keyof typeof baseRest];
    return priority === 1 ? restTimes.primary : restTimes.secondary;
  }

  private determineSessionType(template: any[]): string {
    const patterns = template.map(slot => slot.pattern);
    
    if (patterns.includes('squat') && patterns.includes('hinge') && patterns.includes('push_horizontal')) {
      return 'full_body';
    }
    if (patterns.includes('push_horizontal') && patterns.includes('push_vertical')) {
      return 'push';
    }
    if (patterns.includes('pull_horizontal') && patterns.includes('pull_vertical')) {
      return 'pull';
    }
    if (patterns.includes('squat') && patterns.includes('hinge')) {
      return 'legs';
    }
    
    return 'mixed';
  }

  async findExerciseAlternative(exerciseId: string, params: WorkoutGenerationParams) {
    // First try to find pre-defined alternatives
    const { data: alternatives } = await supabase
      .from('exercise_alternatives')
      .select('alternative_exercise_id')
      .eq('primary_exercise_id', exerciseId);

    if (alternatives && alternatives.length > 0) {
      // Get the actual exercise details
      const { data: exerciseDetails } = await supabase
        .from('exercises')
        .select('*')
        .in('id', alternatives.map(alt => alt.alternative_exercise_id));

      if (exerciseDetails) {
        const validAlternatives = exerciseDetails.filter(exercise => 
          !params.dislikedExercises.includes(exercise.id) &&
          (!exercise.equipment || params.availableEquipment.includes(exercise.equipment))
        );

        if (validAlternatives.length > 0) {
          return validAlternatives[0];
        }
      }
    }

    // If no pre-defined alternatives, find similar exercises by movement pattern
    const originalExercise = this.exercises.find(ex => ex.id === exerciseId);
    if (!originalExercise) return null;

    return this.selectExerciseForPattern(
      originalExercise.movement_pattern,
      params,
      [{ exercise_id: exerciseId }]
    );
  }
}