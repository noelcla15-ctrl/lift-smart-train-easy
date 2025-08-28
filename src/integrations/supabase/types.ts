export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      body_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          notes: string | null
          recorded_at: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          notes?: string | null
          recorded_at?: string
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          notes?: string | null
          recorded_at?: string
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      exercise_alternatives: {
        Row: {
          alternative_exercise_id: string
          created_at: string | null
          id: string
          primary_exercise_id: string
          reason: string | null
          similarity_score: number | null
        }
        Insert: {
          alternative_exercise_id: string
          created_at?: string | null
          id?: string
          primary_exercise_id: string
          reason?: string | null
          similarity_score?: number | null
        }
        Update: {
          alternative_exercise_id?: string
          created_at?: string | null
          id?: string
          primary_exercise_id?: string
          reason?: string | null
          similarity_score?: number | null
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          reps_completed: number[] | null
          sets_completed: number
          user_id: string
          weights_kg: number[] | null
          workout_log_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          reps_completed?: number[] | null
          sets_completed: number
          user_id: string
          weights_kg?: number[] | null
          workout_log_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          reps_completed?: number[] | null
          sets_completed?: number
          user_id?: string
          weights_kg?: number[] | null
          workout_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string
          created_at: string
          difficulty_level: string | null
          equipment: string | null
          experience_level: string | null
          id: string
          instructions: string | null
          is_compound: boolean | null
          movement_pattern: string | null
          muscle_groups: string[]
          name: string
          substitute_for: string[] | null
          target_rpe_range: unknown | null
        }
        Insert: {
          category: string
          created_at?: string
          difficulty_level?: string | null
          equipment?: string | null
          experience_level?: string | null
          id?: string
          instructions?: string | null
          is_compound?: boolean | null
          movement_pattern?: string | null
          muscle_groups: string[]
          name: string
          substitute_for?: string[] | null
          target_rpe_range?: unknown | null
        }
        Update: {
          category?: string
          created_at?: string
          difficulty_level?: string | null
          equipment?: string | null
          experience_level?: string | null
          id?: string
          instructions?: string | null
          is_compound?: boolean | null
          movement_pattern?: string | null
          muscle_groups?: string[]
          name?: string
          substitute_for?: string[] | null
          target_rpe_range?: unknown | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          fitness_level: string | null
          goals: string[] | null
          id: string
          injury_history: string[] | null
          training_experience: string | null
          training_goals: string[] | null
          updated_at: string
          user_id: string
          weekly_availability: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          id?: string
          injury_history?: string[] | null
          training_experience?: string | null
          training_goals?: string[] | null
          updated_at?: string
          user_id: string
          weekly_availability?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          id?: string
          injury_history?: string[] | null
          training_experience?: string | null
          training_goals?: string[] | null
          updated_at?: string
          user_id?: string
          weekly_availability?: number | null
        }
        Relationships: []
      }
      program_phases: {
        Row: {
          created_at: string | null
          id: string
          intensity_percentage: number | null
          name: string
          program_id: string
          rep_range: unknown | null
          volume_multiplier: number | null
          week_end: number
          week_start: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          intensity_percentage?: number | null
          name: string
          program_id: string
          rep_range?: unknown | null
          volume_multiplier?: number | null
          week_end: number
          week_start: number
        }
        Update: {
          created_at?: string | null
          id?: string
          intensity_percentage?: number | null
          name?: string
          program_id?: string
          rep_range?: unknown | null
          volume_multiplier?: number | null
          week_end?: number
          week_start?: number
        }
        Relationships: []
      }
      user_performance_metrics: {
        Row: {
          average_rpe: number | null
          created_at: string | null
          exercise_id: string | null
          fatigue_level: number | null
          id: string
          metric_date: string | null
          motivation_level: number | null
          notes: string | null
          sleep_quality: number | null
          soreness_level: number | null
          stress_level: number | null
          user_id: string
          workout_log_id: string | null
        }
        Insert: {
          average_rpe?: number | null
          created_at?: string | null
          exercise_id?: string | null
          fatigue_level?: number | null
          id?: string
          metric_date?: string | null
          motivation_level?: number | null
          notes?: string | null
          sleep_quality?: number | null
          soreness_level?: number | null
          stress_level?: number | null
          user_id: string
          workout_log_id?: string | null
        }
        Update: {
          average_rpe?: number | null
          created_at?: string | null
          exercise_id?: string | null
          fatigue_level?: number | null
          id?: string
          metric_date?: string | null
          motivation_level?: number | null
          notes?: string | null
          sleep_quality?: number | null
          soreness_level?: number | null
          stress_level?: number | null
          user_id?: string
          workout_log_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          auto_progress_enabled: boolean | null
          available_equipment: string[] | null
          created_at: string | null
          disliked_exercises: string[] | null
          id: string
          preferred_rest_between_sets: number | null
          preferred_workout_duration: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_progress_enabled?: boolean | null
          available_equipment?: string[] | null
          created_at?: string | null
          disliked_exercises?: string[] | null
          id?: string
          preferred_rest_between_sets?: number | null
          preferred_workout_duration?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_progress_enabled?: boolean | null
          available_equipment?: string[] | null
          created_at?: string | null
          disliked_exercises?: string[] | null
          id?: string
          preferred_rest_between_sets?: number | null
          preferred_workout_duration?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets: number
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          name: string
          notes: string | null
          started_at: string
          user_id: string
          workout_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          name: string
          notes?: string | null
          started_at?: string
          user_id: string
          workout_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          name?: string
          notes?: string | null
          started_at?: string
          user_id?: string
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_programs: {
        Row: {
          created_at: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          name: string
          program_type: string
          sessions_per_week: number | null
          training_focus: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          program_type: string
          sessions_per_week?: number | null
          training_focus: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          program_type?: string
          sessions_per_week?: number | null
          training_focus?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_duration_minutes: number | null
          id: string
          is_template: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_template?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_template?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
