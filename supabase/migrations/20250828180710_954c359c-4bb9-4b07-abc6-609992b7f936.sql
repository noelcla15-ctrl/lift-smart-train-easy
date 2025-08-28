-- Enhance existing tables for the comprehensive workout system

-- Add fields to profiles table for workout preferences
ALTER TABLE public.profiles 
ADD COLUMN training_experience text CHECK (training_experience IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN weekly_availability integer DEFAULT 3 CHECK (weekly_availability >= 2 AND weekly_availability <= 6),
ADD COLUMN injury_history text[],
ADD COLUMN training_goals text[] DEFAULT ARRAY['general_fitness'];

-- Add fields to exercises table for better categorization and substitution
ALTER TABLE public.exercises 
ADD COLUMN movement_pattern text CHECK (movement_pattern IN ('squat', 'hinge', 'lunge', 'push_vertical', 'push_horizontal', 'pull_vertical', 'pull_horizontal', 'carry', 'rotation', 'isolation')),
ADD COLUMN experience_level text DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN substitute_for uuid[],
ADD COLUMN is_compound boolean DEFAULT true,
ADD COLUMN target_rpe_range int4range DEFAULT '[6,8]';

-- Create user_preferences table for equipment and workout preferences
CREATE TABLE public.user_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    available_equipment text[] DEFAULT ARRAY['bodyweight'],
    disliked_exercises uuid[] DEFAULT ARRAY[]::uuid[],
    preferred_workout_duration integer DEFAULT 60, -- minutes
    preferred_rest_between_sets integer DEFAULT 90, -- seconds
    auto_progress_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
ON public.user_preferences 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create workout_programs table for generated program templates
CREATE TABLE public.workout_programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    program_type text NOT NULL CHECK (program_type IN ('full_body', 'upper_lower', 'push_pull_legs', 'custom')),
    training_focus text NOT NULL CHECK (training_focus IN ('strength', 'hypertrophy', 'endurance', 'general_fitness')),
    duration_weeks integer DEFAULT 12,
    sessions_per_week integer DEFAULT 3,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on workout_programs
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_programs
CREATE POLICY "Users can view their own programs" 
ON public.workout_programs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own programs" 
ON public.workout_programs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own programs" 
ON public.workout_programs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own programs" 
ON public.workout_programs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create program_phases table for periodization
CREATE TABLE public.program_phases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id uuid NOT NULL,
    name text NOT NULL,
    week_start integer NOT NULL,
    week_end integer NOT NULL,
    intensity_percentage numeric(4,2) DEFAULT 80.0, -- percentage of 1RM
    volume_multiplier numeric(3,2) DEFAULT 1.0,
    rep_range int4range DEFAULT '[8,12]',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on program_phases
ALTER TABLE public.program_phases ENABLE ROW LEVEL SECURITY;

-- Create policies for program_phases
CREATE POLICY "Users can view phases for their programs" 
ON public.program_phases 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.workout_programs 
    WHERE workout_programs.id = program_phases.program_id 
    AND workout_programs.user_id = auth.uid()
));

CREATE POLICY "Users can create phases for their programs" 
ON public.program_phases 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.workout_programs 
    WHERE workout_programs.id = program_phases.program_id 
    AND workout_programs.user_id = auth.uid()
));

CREATE POLICY "Users can update phases for their programs" 
ON public.program_phases 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.workout_programs 
    WHERE workout_programs.id = program_phases.program_id 
    AND workout_programs.user_id = auth.uid()
));

CREATE POLICY "Users can delete phases for their programs" 
ON public.program_phases 
FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM public.workout_programs 
    WHERE workout_programs.id = program_phases.program_id 
    AND workout_programs.user_id = auth.uid()
));

-- Create exercise_alternatives table for exercise substitutions
CREATE TABLE public.exercise_alternatives (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_exercise_id uuid NOT NULL,
    alternative_exercise_id uuid NOT NULL,
    similarity_score numeric(3,2) DEFAULT 0.8, -- 0.0 to 1.0
    reason text, -- why this is a good alternative
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(primary_exercise_id, alternative_exercise_id)
);

-- Enable RLS on exercise_alternatives (public read, no user-specific data)
ALTER TABLE public.exercise_alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercise alternatives are viewable by everyone" 
ON public.exercise_alternatives 
FOR SELECT 
USING (true);

-- Create user_performance_metrics table for tracking progress and fatigue
CREATE TABLE public.user_performance_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    workout_log_id uuid,
    exercise_id uuid,
    metric_date date DEFAULT CURRENT_DATE,
    average_rpe numeric(3,1), -- 1.0 to 10.0
    fatigue_level integer CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
    soreness_level integer CHECK (soreness_level >= 1 AND soreness_level <= 10),
    motivation_level integer CHECK (motivation_level >= 1 AND motivation_level <= 10),
    sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    stress_level integer CHECK (stress_level >= 1 AND stress_level <= 10),
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_performance_metrics
ALTER TABLE public.user_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for user_performance_metrics
CREATE POLICY "Users can view their own performance metrics" 
ON public.user_performance_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own performance metrics" 
ON public.user_performance_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance metrics" 
ON public.user_performance_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own performance metrics" 
ON public.user_performance_metrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_programs_updated_at
    BEFORE UPDATE ON public.workout_programs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_workout_programs_user_id ON public.workout_programs(user_id);
CREATE INDEX idx_workout_programs_active ON public.workout_programs(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_program_phases_program_id ON public.program_phases(program_id);
CREATE INDEX idx_exercise_alternatives_primary ON public.exercise_alternatives(primary_exercise_id);
CREATE INDEX idx_user_performance_metrics_user_date ON public.user_performance_metrics(user_id, metric_date);
CREATE INDEX idx_exercises_movement_pattern ON public.exercises(movement_pattern);
CREATE INDEX idx_exercises_experience_level ON public.exercises(experience_level);