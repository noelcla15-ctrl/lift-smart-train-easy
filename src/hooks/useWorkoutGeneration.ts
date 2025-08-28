import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkoutProgram } from './useWorkoutProgram';
import { WorkoutGenerator } from '@/utils/workoutGenerator';
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedWorkout {
  name: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    restTime: number;
    notes?: string;
    exerciseId: string;
  }>;
  estimatedDuration: number;
  difficulty: string;
}

export const useWorkoutGeneration = () => {
  const { user } = useAuth();
  const { activeProgram } = useWorkoutProgram();
  const [todaysWorkout, setTodaysWorkout] = useState<GeneratedWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && activeProgram) {
      generateTodaysWorkout();
    }
  }, [user, activeProgram]);

  const generateTodaysWorkout = async () => {
    if (!user || !activeProgram) return;

    setIsLoading(true);
    try {
      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get recent workout logs to determine what to do today
      const { data: recentLogs } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false });

      const generator = new WorkoutGenerator();
      await generator.initialize();

      // Determine workout type based on program and recent activity
      const workoutType = determineWorkoutType(activeProgram, recentLogs || []);
      
      // Generate workout parameters
      const params = {
        trainingExperience: 'intermediate' as const, // Could come from user profile
        trainingGoals: activeProgram.training_focus === 'hypertrophy' ? ['muscle_gain'] : ['strength'],
        weeklyAvailability: activeProgram.sessions_per_week,
        availableEquipment: preferences?.available_equipment || ['barbell', 'dumbbell'],
        dislikedExercises: preferences?.disliked_exercises || [],
        preferredDuration: preferences?.preferred_workout_duration || 60,
        trainingFocus: activeProgram.training_focus as 'hypertrophy' | 'strength' | 'endurance' | 'general_fitness',
      };

      const program = await generator.generateProgram(params);
      
      // Get today's workout from the generated program
      const workout = program[0]; // Get the first workout from the generated program
      
      const generatedWorkout: GeneratedWorkout = {
        name: workout.name,
        exercises: workout.exercises.map(ex => ({
          id: crypto.randomUUID(),
          name: ex.exercise_name,
          sets: ex.sets,
          reps: typeof ex.reps === 'string' ? parseInt(ex.reps) : ex.reps,
          weight: ex.weight_kg ? Math.round(ex.weight_kg * 2.20462) : undefined, // Convert kg to lbs
          restTime: ex.rest_seconds,
          notes: ex.notes || '',
          exerciseId: ex.exercise_id,
        })),
        estimatedDuration: workout.estimated_duration,
        difficulty: activeProgram.training_focus,
      };

      setTodaysWorkout(generatedWorkout);
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineWorkoutType = (program: any, recentLogs: any[]) => {
    // Simple logic to determine what type of workout to do today
    // Based on program type and what was done recently
    
    if (program.program_type === 'full_body') {
      return 'full_body';
    }
    
    if (program.program_type === 'upper_lower') {
      const lastWorkout = recentLogs[0];
      if (!lastWorkout) return 'upper';
      
      // Alternate between upper and lower
      return lastWorkout.name.toLowerCase().includes('upper') ? 'lower' : 'upper';
    }
    
    if (program.program_type === 'push_pull_legs') {
      const lastWorkout = recentLogs[0];
      if (!lastWorkout) return 'push';
      
      // Cycle through push, pull, legs
      if (lastWorkout.name.toLowerCase().includes('push')) return 'pull';
      if (lastWorkout.name.toLowerCase().includes('pull')) return 'legs';
      return 'push';
    }
    
    return 'full_body';
  };

  return {
    todaysWorkout,
    isLoading,
    generateTodaysWorkout,
  };
};