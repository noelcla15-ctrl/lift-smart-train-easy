import { useEffect, useState } from "react";
import { useWorkoutProgram } from "./useWorkoutProgram";
import { WorkoutGenerator } from "@/utils/workoutGenerator";
import { GeneratedWorkout } from "@/types/workout";

export type { GeneratedWorkout };

export function useWorkoutGeneration() {
  const { activeProgram, userPreferences } = useWorkoutProgram() as any;
  const [todaysWorkout, setTodaysWorkout] = useState<GeneratedWorkout | null>(null);
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
          trainingExperience: "beginner" as const, // replace if you store this
          trainingGoals: [],
          weeklyAvailability: Number(activeProgram.sessions_per_week || 3),
          availableEquipment,
          dislikedExercises: [], // replace if you store this
          preferredDuration: Number(userPreferences.typicalSessionMin || 45),
          trainingFocus: String(activeProgram.training_focus || "general_fitness") as "strength" | "hypertrophy" | "endurance" | "general_fitness",
        };

        const plan = await gen.generateProgram(params);
        const idx = new Date().getDay() % Math.max(1, plan.length);
        const w = plan[idx];

        const mapExercise = (x: any) => ({
          id: x.exercise_id,
          name: x.exercise_name,
          sets: x.sets,
          reps: x.reps,
          weight: x.weight_kg,
          restTime: x.rest_seconds,
          notes: x.notes,
          exerciseId: x.exercise_id,
        });

        setTodaysWorkout({
          name: w.name,
          warmup: w.warmup?.map(mapExercise),
          exercises: w.exercises.map(mapExercise),
          cooldown: w.cooldown?.map(mapExercise),
          estimatedDuration: w.estimated_duration,
          difficulty: params.trainingFocus || "general_fitness",
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
