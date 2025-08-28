import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WorkoutSet {
  weight: number;
  reps: number;
  rpe: number | null;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restTime: number;
  notes: string;
  exerciseId: string;
}

export interface ActiveWorkout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startedAt: Date;
  completedAt?: Date;
}

export const useWorkoutSession = () => {
  const { user } = useAuth();
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startWorkout = async (workout: Omit<ActiveWorkout, 'id' | 'startedAt'>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          name: workout.name,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newWorkout: ActiveWorkout = {
        ...workout,
        id: data.id,
        startedAt: new Date(data.started_at),
      };

      setActiveWorkout(newWorkout);
      toast({
        title: "Workout Started",
        description: `Started ${workout.name}`,
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Error",
        description: "Failed to start workout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logSet = async (exerciseIndex: number, setIndex: number, setData: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;

    const updatedWorkout = { ...activeWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex] = {
      ...updatedWorkout.exercises[exerciseIndex].sets[setIndex],
      ...setData,
    };

    setActiveWorkout(updatedWorkout);

    // Log to database
    if (setData.completed && user) {
      try {
        await supabase
          .from('exercise_logs')
          .insert({
            user_id: user.id,
            workout_log_id: activeWorkout.id,
            exercise_id: updatedWorkout.exercises[exerciseIndex].exerciseId,
            sets_completed: 1,
            weights_kg: setData.weight ? [setData.weight * 0.453592] : [],
            reps_completed: setData.reps ? [setData.reps] : [],
          });
      } catch (error) {
        console.error('Error logging set:', error);
      }
    }
  };

  const completeWorkout = async () => {
    if (!activeWorkout || !user) return;

    setIsLoading(true);
    try {
      const completedAt = new Date();
      const duration = Math.round((completedAt.getTime() - activeWorkout.startedAt.getTime()) / 60000);

      await supabase
        .from('workout_logs')
        .update({
          completed_at: completedAt.toISOString(),
          duration_minutes: duration,
        })
        .eq('id', activeWorkout.id);

      setActiveWorkout(null);
      toast({
        title: "Workout Complete!",
        description: `Great job! You worked out for ${duration} minutes.`,
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Error",
        description: "Failed to complete workout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeWorkout,
    isLoading,
    startWorkout,
    logSet,
    completeWorkout,
  };
};