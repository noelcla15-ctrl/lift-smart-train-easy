import { useEffect, useState } from "react";
import { useWorkoutProgram } from "./useWorkoutProgram";
// Adjust path if your file lives elsewhere
import { WorkoutGenerator } from "@/lib/WorkoutGenerator";

type UISet = {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  restTime: number;
  notes?: string;
  movementPattern: string;
  muscleGroups: string[];
  exerciseId: string;
};

type UIWorkout = {
  name: string;
  estimatedDuration: number;
  sessionType: string;
  warmup?: UISet[];
  exercises: UISet[];
  cooldown?: UISet[];
};

export function useWorkoutGeneration() {
  const { activeProgram, userPreferences } = useWorkoutProgram() as any;
  const [todaysWorkout, setTodaysWorkout] = useState<UIWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!activeProgram || !userPreferences) return;
      setIsLoading(true);
      try {
        const gen = new WorkoutGenerator();

        const availableEquipment = Object.entries(userPreferences.equipment || {})
          .filter(([, v]) => Boolean(v))
          .map(([k]) => k);

        const params = {
          trainingExperience: "beginner", // replace if you store this
          trainingGoals: [],
          weeklyAvailability: Number(activeProgram.sessions_per_week || 3),
          availableEquipment,
          dislikedExercises: [], // replace if you store this
          preferredDuration: Number(userPreferences.typicalSessionMin || 45),
          trainingFocus: String(activeProgram.training_focus || "general_fitness"),
        };

        const plan = await gen.generateProgram(params);
        const idx = new Date().getDay() % Math.max(1, plan.length);
        const w = plan[idx];

        const mapSet = (x: any): UISet => ({
          id: x.exercise_id,
          name: x.exercise_name,
          sets: x.sets,
          reps: x.reps,
          restTime: x.rest_seconds,
          notes: x.notes,
          movementPattern: x.movement_pattern,
          muscleGroups: x.muscle_groups,
          exerciseId: x.exercise_id,
        });

        setTodaysWorkout({
          name: w.name,
          estimatedDuration: w.estimated_duration,
          sessionType: w.session_type,
          warmup: w.warmup?.map(mapSet),
          exercises: w.exercises.map(mapSet),
          cooldown: w.cooldown?.map(mapSet),
        });
      } catch (e) {
        console.error("generateProgram failed", e);
        setTodaysWorkout(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [activeProgram, userPreferences]);

  return { todaysWorkout, isLoading };
}
