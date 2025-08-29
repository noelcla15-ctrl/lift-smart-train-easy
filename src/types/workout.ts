// Consolidated workout type definitions to eliminate duplication

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

export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  weight?: number;
  restTime: number;
  notes?: string;
  exerciseId: string;
}

export interface GeneratedWorkout {
  name: string;
  warmup?: ExerciseTemplate[];
  exercises: ExerciseTemplate[];
  cooldown?: ExerciseTemplate[];
  estimatedDuration: number;
  difficulty: string;
}

export interface UserPreferences {
  available_equipment: string[];
  preferred_workout_duration: number;
  preferred_rest_between_sets: number;
  include_warmup: boolean;
  include_cooldown: boolean;
  warmup_duration_minutes: number;
  cooldown_duration_minutes: number;
  auto_progress_enabled: boolean;
  disliked_exercises: string[];
}

export interface UserProfile {
  display_name: string;
  avatar_url?: string;
  fitness_level: string;
  training_experience: string;
  training_goals: string[];
  injury_history: string[];
  weekly_availability: number;
}