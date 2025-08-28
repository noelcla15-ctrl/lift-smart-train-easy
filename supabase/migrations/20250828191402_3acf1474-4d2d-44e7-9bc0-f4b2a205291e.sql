-- First, update existing exercises with proper movement patterns
UPDATE exercises SET movement_pattern = 'push_vertical' WHERE name = 'Push-ups';
UPDATE exercises SET movement_pattern = 'pull_vertical' WHERE name = 'Pull-ups';
UPDATE exercises SET movement_pattern = 'squat' WHERE name = 'Squats';
UPDATE exercises SET movement_pattern = 'hinge' WHERE name = 'Deadlifts';
UPDATE exercises SET movement_pattern = 'lunge' WHERE name = 'Lunges';
UPDATE exercises SET movement_pattern = 'core' WHERE name = 'Plank';
UPDATE exercises SET movement_pattern = 'cardio' WHERE name = 'Burpees';
UPDATE exercises SET movement_pattern = 'cardio' WHERE name = 'Mountain Climbers';

-- Now insert comprehensive exercise database
INSERT INTO exercises (name, category, muscle_groups, equipment, movement_pattern, experience_level, difficulty_level, is_compound, instructions) VALUES

-- Push Movements
('Chest Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'dumbbell', 'push_horizontal', 'beginner', 'easy', true, 'Lie on bench, press dumbbells up and together'),
('Incline Chest Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'dumbbell', 'push_incline', 'intermediate', 'medium', true, 'Incline bench press targeting upper chest'),
('Shoulder Press', 'Strength', ARRAY['shoulders', 'triceps'], 'dumbbell', 'push_vertical', 'beginner', 'easy', true, 'Press dumbbells overhead from shoulder height'),
('Tricep Dips', 'Strength', ARRAY['triceps', 'chest', 'shoulders'], 'bodyweight', 'push_vertical', 'intermediate', 'medium', true, 'Dip down and push back up using parallel bars or chair'),
('Pike Push-ups', 'Strength', ARRAY['shoulders', 'triceps'], 'bodyweight', 'push_vertical', 'intermediate', 'medium', true, 'Inverted V position push-ups targeting shoulders'),

-- Pull Movements  
('Bent Over Row', 'Strength', ARRAY['back', 'biceps'], 'dumbbell', 'pull_horizontal', 'beginner', 'easy', true, 'Bend forward and row dumbbells to torso'),
('Lat Pulldown', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_vertical', 'beginner', 'easy', true, 'Pull cable down from overhead to chest'),
('Bicep Curls', 'Strength', ARRAY['biceps'], 'dumbbell', 'isolation', 'beginner', 'easy', false, 'Curl dumbbells from arms extended to shoulders'),
('Hammer Curls', 'Strength', ARRAY['biceps', 'forearms'], 'dumbbell', 'isolation', 'beginner', 'easy', false, 'Curl dumbbells with neutral grip'),
('Face Pulls', 'Strength', ARRAY['rear_delts', 'upper_back'], 'cable', 'pull_horizontal', 'intermediate', 'medium', false, 'Pull cable to face level separating hands'),
('Inverted Rows', 'Strength', ARRAY['back', 'biceps'], 'bodyweight', 'pull_horizontal', 'intermediate', 'medium', true, 'Horizontal pulling using body weight'),

-- Squat Patterns
('Goblet Squat', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'dumbbell', 'squat', 'beginner', 'easy', true, 'Hold dumbbell at chest and squat down'),
('Jump Squats', 'Cardio', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'squat', 'intermediate', 'medium', true, 'Explosive squat with jump at top'),
('Wall Sit', 'Strength', ARRAY['quadriceps', 'glutes'], 'bodyweight', 'squat', 'beginner', 'easy', false, 'Hold squat position against wall'),
('Bulgarian Split Squat', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'intermediate', 'medium', true, 'Single leg squat with rear foot elevated'),

-- Hinge Patterns
('Romanian Deadlift', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'dumbbell', 'hinge', 'intermediate', 'medium', true, 'Hip hinge movement with slight knee bend'),
('Hip Thrust', 'Strength', ARRAY['glutes', 'hamstrings'], 'bodyweight', 'hinge', 'beginner', 'easy', true, 'Bridge movement focusing on glutes'),
('Good Mornings', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'hinge', 'advanced', 'hard', true, 'Hip hinge with barbell on shoulders'),
('Single Leg Deadlift', 'Strength', ARRAY['hamstrings', 'glutes', 'core'], 'dumbbell', 'hinge', 'intermediate', 'medium', true, 'Balance on one leg while hinging at hip'),

-- Lunge Patterns
('Forward Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'easy', true, 'Step forward into lunge position'),
('Reverse Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'easy', true, 'Step backwards into lunge position'),
('Lateral Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'adductors'], 'bodyweight', 'lunge', 'intermediate', 'medium', true, 'Side step into lunge position'),
('Walking Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'intermediate', 'medium', true, 'Alternate forward lunges while walking'),
('Step-ups', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'easy', true, 'Step up onto elevated surface'),

-- Core Exercises
('Crunches', 'Core', ARRAY['core'], 'bodyweight', 'core', 'beginner', 'easy', false, 'Abdominal crunching movement'),
('Russian Twists', 'Core', ARRAY['core', 'obliques'], 'bodyweight', 'core', 'beginner', 'easy', false, 'Seated torso rotation movement'),
('Dead Bug', 'Core', ARRAY['core'], 'bodyweight', 'core', 'beginner', 'easy', false, 'Lying opposite arm/leg extension'),
('Bicycle Crunches', 'Core', ARRAY['core', 'obliques'], 'bodyweight', 'core', 'intermediate', 'medium', false, 'Alternating knee to elbow crunches'),
('Leg Raises', 'Core', ARRAY['core', 'hip_flexors'], 'bodyweight', 'core', 'intermediate', 'medium', false, 'Lying leg lifting movement'),
('Mountain Climbers', 'Cardio', ARRAY['core', 'shoulders', 'legs'], 'bodyweight', 'cardio', 'beginner', 'easy', false, 'Alternating knee drives in plank position'),

-- Cardio/Conditioning
('Jumping Jacks', 'Cardio', ARRAY['full_body'], 'bodyweight', 'cardio', 'beginner', 'easy', false, 'Jump feet apart while raising arms overhead'),
('High Knees', 'Cardio', ARRAY['legs', 'core'], 'bodyweight', 'cardio', 'beginner', 'easy', false, 'Running in place with high knee lifts'),
('Butt Kickers', 'Cardio', ARRAY['hamstrings', 'glutes'], 'bodyweight', 'cardio', 'beginner', 'easy', false, 'Running in place kicking heels to glutes'),
('Bear Crawl', 'Strength', ARRAY['shoulders', 'core', 'legs'], 'bodyweight', 'crawl', 'intermediate', 'medium', true, 'Crawl forward on hands and feet'),

-- Additional Isolation Exercises
('Calf Raises', 'Strength', ARRAY['calves'], 'bodyweight', 'isolation', 'beginner', 'easy', false, 'Rise up on toes and lower slowly'),
('Lateral Raises', 'Strength', ARRAY['shoulders'], 'dumbbell', 'isolation', 'beginner', 'easy', false, 'Raise arms out to sides at shoulder height'),
('Front Raises', 'Strength', ARRAY['shoulders'], 'dumbbell', 'isolation', 'beginner', 'easy', false, 'Raise arms forward to shoulder height'),
('Tricep Extensions', 'Strength', ARRAY['triceps'], 'dumbbell', 'isolation', 'beginner', 'easy', false, 'Extend arms overhead lowering weight behind head'),
('Chest Flyes', 'Strength', ARRAY['chest'], 'dumbbell', 'isolation', 'intermediate', 'medium', false, 'Fly arms open and together in arc motion'),

-- Barbell Exercises
('Barbell Squats', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'barbell', 'squat', 'intermediate', 'medium', true, 'Back squat with barbell on shoulders'),
('Barbell Deadlifts', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'hinge', 'intermediate', 'medium', true, 'Conventional deadlift from floor'),
('Barbell Rows', 'Strength', ARRAY['back', 'biceps'], 'barbell', 'pull_horizontal', 'intermediate', 'medium', true, 'Bent over barbell rowing'),
('Bench Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'barbell', 'push_horizontal', 'intermediate', 'medium', true, 'Horizontal pressing from bench'),
('Overhead Press', 'Strength', ARRAY['shoulders', 'triceps'], 'barbell', 'push_vertical', 'intermediate', 'medium', true, 'Standing overhead barbell press'),

-- Machine/Cable Exercises  
('Lat Pulldowns', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_vertical', 'beginner', 'easy', true, 'Seated cable pulling to chest'),
('Cable Rows', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_horizontal', 'beginner', 'easy', true, 'Seated cable rowing'),
('Leg Press', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'machine', 'squat', 'beginner', 'easy', true, 'Machine-based leg pressing movement'),
('Leg Curls', 'Strength', ARRAY['hamstrings'], 'machine', 'isolation', 'beginner', 'easy', false, 'Machine-based hamstring curls'),
('Leg Extensions', 'Strength', ARRAY['quadriceps'], 'machine', 'isolation', 'beginner', 'easy', false, 'Machine-based quad extensions');