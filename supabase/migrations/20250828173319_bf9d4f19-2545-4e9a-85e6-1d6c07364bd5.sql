-- Create user profiles table with RLS
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table (public data)
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT,
  instructions TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table (user-specific)
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_duration_minutes INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_template BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_exercises table (exercises within a workout)
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL CHECK (sets > 0),
  reps INTEGER,
  weight_kg DECIMAL,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_logs table (completed workout sessions)
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_logs table (individual exercise performance)
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER NOT NULL CHECK (sets_completed >= 0),
  reps_completed INTEGER[],
  weights_kg DECIMAL[],
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create body_metrics table (weight, measurements)
CREATE TABLE public.body_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('weight', 'body_fat', 'muscle_mass', 'chest', 'waist', 'hips', 'bicep', 'thigh')),
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for exercises table (public read, admin write)
CREATE POLICY "Exercises are viewable by everyone" 
ON public.exercises 
FOR SELECT 
USING (true);

-- RLS Policies for workouts table
CREATE POLICY "Users can view their own workouts" 
ON public.workouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
ON public.workouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
ON public.workouts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for workout_exercises table
CREATE POLICY "Users can view workout exercises for their workouts" 
ON public.workout_exercises 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.workouts 
  WHERE workouts.id = workout_exercises.workout_id 
  AND workouts.user_id = auth.uid()
));

CREATE POLICY "Users can create workout exercises for their workouts" 
ON public.workout_exercises 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.workouts 
  WHERE workouts.id = workout_exercises.workout_id 
  AND workouts.user_id = auth.uid()
));

CREATE POLICY "Users can update workout exercises for their workouts" 
ON public.workout_exercises 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.workouts 
  WHERE workouts.id = workout_exercises.workout_id 
  AND workouts.user_id = auth.uid()
));

CREATE POLICY "Users can delete workout exercises for their workouts" 
ON public.workout_exercises 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.workouts 
  WHERE workouts.id = workout_exercises.workout_id 
  AND workouts.user_id = auth.uid()
));

-- RLS Policies for workout_logs table
CREATE POLICY "Users can view their own workout logs" 
ON public.workout_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout logs" 
ON public.workout_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" 
ON public.workout_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" 
ON public.workout_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for exercise_logs table
CREATE POLICY "Users can view their own exercise logs" 
ON public.exercise_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise logs" 
ON public.exercise_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise logs" 
ON public.exercise_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise logs" 
ON public.exercise_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for body_metrics table
CREATE POLICY "Users can view their own body metrics" 
ON public.body_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own body metrics" 
ON public.body_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics" 
ON public.body_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics" 
ON public.body_metrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample exercises
INSERT INTO public.exercises (name, category, muscle_groups, equipment, instructions, difficulty_level) VALUES
('Push-ups', 'Strength', ARRAY['chest', 'shoulders', 'triceps'], 'bodyweight', 'Start in plank position, lower body to floor, push back up', 'beginner'),
('Squats', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'Stand with feet shoulder-width apart, lower hips back and down, return to standing', 'beginner'),
('Pull-ups', 'Strength', ARRAY['back', 'biceps'], 'pull-up bar', 'Hang from bar, pull body up until chin clears bar, lower with control', 'intermediate'),
('Plank', 'Core', ARRAY['core', 'shoulders'], 'bodyweight', 'Hold body in straight line from head to heels, engaging core muscles', 'beginner'),
('Burpees', 'Cardio', ARRAY['full body'], 'bodyweight', 'Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead', 'intermediate'),
('Deadlifts', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'Stand with barbell over feet, hinge at hips to lower bar, drive hips forward to stand', 'advanced'),
('Mountain Climbers', 'Cardio', ARRAY['core', 'shoulders', 'legs'], 'bodyweight', 'Start in plank, alternate bringing knees toward chest rapidly', 'intermediate'),
('Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'Step forward into lunge position, lower back knee toward floor, return to start', 'beginner');