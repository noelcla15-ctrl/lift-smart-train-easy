import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WorkoutProgram {
  id: string;
  user_id: string;
  name: string;
  program_type: string;
  training_focus: string;
  duration_weeks: number;
  sessions_per_week: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  available_equipment: string[];
  disliked_exercises: string[];
  preferred_workout_duration: number;
  preferred_rest_between_sets: number;
  auto_progress_enabled: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_groups: string[];
  equipment?: string;
  instructions?: string;
  difficulty_level?: string;
  movement_pattern?: string;
  experience_level?: string;
  is_compound?: boolean;
  target_rpe_range?: string;
}

export const useWorkoutProgram = () => {
  const [activeProgram, setActiveProgram] = useState<WorkoutProgram | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchActiveProgram();
      fetchUserPreferences();
    }
  }, [user]);

  const fetchActiveProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_programs')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      setActiveProgram(data);
    } catch (error) {
      console.error('Error fetching active program:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserPreferences(data);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (programData: Partial<WorkoutProgram>) => {
    try {
      // Deactivate current active program
      if (activeProgram) {
        await supabase
          .from('workout_programs')
          .update({ is_active: false })
          .eq('id', activeProgram.id);
      }

      // Create new program
      const { data, error } = await supabase
        .from('workout_programs')
        .insert([{
          name: programData.name || 'New Program',
          program_type: programData.program_type || 'full_body',
          training_focus: programData.training_focus || 'general_fitness',
          duration_weeks: programData.duration_weeks || 12,
          sessions_per_week: programData.sessions_per_week || 3,
          is_active: true,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      setActiveProgram(data);
      toast.success('Workout program created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create workout program');
      throw error;
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert([{
          ...preferences,
          user_id: user?.id
        }], { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setUserPreferences(data);
      toast.success('Preferences updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      throw error;
    }
  };

  return {
    activeProgram,
    userPreferences,
    loading,
    createProgram,
    updateUserPreferences,
    fetchActiveProgram,
    fetchUserPreferences
  };
};