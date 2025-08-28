-- First, update existing exercises with proper movement patterns
UPDATE exercises SET movement_pattern = 'push_vertical' WHERE name = 'Push-ups';
UPDATE exercises SET movement_pattern = 'pull_vertical' WHERE name = 'Pull-ups';
UPDATE exercises SET movement_pattern = 'squat' WHERE name = 'Squats';
UPDATE exercises SET movement_pattern = 'hinge' WHERE name = 'Deadlifts';
UPDATE exercises SET movement_pattern = 'lunge' WHERE name = 'Lunges';
UPDATE exercises SET movement_pattern = 'isolation' WHERE name = 'Plank';
UPDATE exercises SET movement_pattern = 'isolation' WHERE name = 'Burpees';
UPDATE exercises SET movement_pattern = 'isolation' WHERE name = 'Mountain Climbers';

-- Now insert comprehensive exercise database with correct constraints
INSERT INTO exercises (name, category, muscle_groups, equipment, movement_pattern, experience_level, difficulty_level, is_compound, instructions) VALUES

-- Push Movements
('Chest Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'dumbbell', 'push_horizontal', 'beginner', 'beginner', true, 'Lie on bench, press dumbbells up and together'),
('Incline Chest Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'dumbbell', 'push_vertical', 'intermediate', 'intermediate', true, 'Incline bench press targeting upper chest'),
('Shoulder Press', 'Strength', ARRAY['shoulders', 'triceps'], 'dumbbell', 'push_vertical', 'beginner', 'beginner', true, 'Press dumbbells overhead from shoulder height'),
('Tricep Dips', 'Strength', ARRAY['triceps', 'chest', 'shoulders'], 'bodyweight', 'push_vertical', 'intermediate', 'intermediate', true, 'Dip down and push back up using parallel bars or chair'),
('Pike Push-ups', 'Strength', ARRAY['shoulders', 'triceps'], 'bodyweight', 'push_vertical', 'intermediate', 'intermediate', true, 'Inverted V position push-ups targeting shoulders'),

-- Pull Movements  
('Bent Over Row', 'Strength', ARRAY['back', 'biceps'], 'dumbbell', 'pull_horizontal', 'beginner', 'beginner', true, 'Bend forward and row dumbbells to torso'),
('Lat Pulldown', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_vertical', 'beginner', 'beginner', true, 'Pull cable down from overhead to chest'),
('Bicep Curls', 'Strength', ARRAY['biceps'], 'dumbbell', 'isolation', 'beginner', 'beginner', false, 'Curl dumbbells from arms extended to shoulders'),
('Hammer Curls', 'Strength', ARRAY['biceps', 'forearms'], 'dumbbell', 'isolation', 'beginner', 'beginner', false, 'Curl dumbbells with neutral grip'),
('Face Pulls', 'Strength', ARRAY['rear_delts', 'upper_back'], 'cable', 'pull_horizontal', 'intermediate', 'intermediate', false, 'Pull cable to face level separating hands'),
('Inverted Rows', 'Strength', ARRAY['back', 'biceps'], 'bodyweight', 'pull_horizontal', 'intermediate', 'intermediate', true, 'Horizontal pulling using body weight'),

-- Squat Patterns
('Goblet Squat', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'dumbbell', 'squat', 'beginner', 'beginner', true, 'Hold dumbbell at chest and squat down'),
('Jump Squats', 'Cardio', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'squat', 'intermediate', 'intermediate', true, 'Explosive squat with jump at top'),
('Wall Sit', 'Strength', ARRAY['quadriceps', 'glutes'], 'bodyweight', 'squat', 'beginner', 'beginner', false, 'Hold squat position against wall'),
('Bulgarian Split Squat', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'intermediate', 'intermediate', true, 'Single leg squat with rear foot elevated'),

-- Hinge Patterns
('Romanian Deadlift', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'dumbbell', 'hinge', 'intermediate', 'intermediate', true, 'Hip hinge movement with slight knee bend'),
('Hip Thrust', 'Strength', ARRAY['glutes', 'hamstrings'], 'bodyweight', 'hinge', 'beginner', 'beginner', true, 'Bridge movement focusing on glutes'),
('Good Mornings', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'hinge', 'advanced', 'advanced', true, 'Hip hinge with barbell on shoulders'),
('Single Leg Deadlift', 'Strength', ARRAY['hamstrings', 'glutes', 'core'], 'dumbbell', 'hinge', 'intermediate', 'intermediate', true, 'Balance on one leg while hinging at hip'),

-- Lunge Patterns
('Forward Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'beginner', true, 'Step forward into lunge position'),
('Reverse Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'beginner', true, 'Step backwards into lunge position'),
('Lateral Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'adductors'], 'bodyweight', 'lunge', 'intermediate', 'intermediate', true, 'Side step into lunge position'),
('Walking Lunges', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'intermediate', 'intermediate', true, 'Alternate forward lunges while walking'),
('Step-ups', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'bodyweight', 'lunge', 'beginner', 'beginner', true, 'Step up onto elevated surface'),

-- Core and Isolation Exercises
('Crunches', 'Core', ARRAY['core'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Abdominal crunching movement'),
('Russian Twists', 'Core', ARRAY['core', 'obliques'], 'bodyweight', 'rotation', 'beginner', 'beginner', false, 'Seated torso rotation movement'),
('Dead Bug', 'Core', ARRAY['core'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Lying opposite arm/leg extension'),
('Bicycle Crunches', 'Core', ARRAY['core', 'obliques'], 'bodyweight', 'rotation', 'intermediate', 'intermediate', false, 'Alternating knee to elbow crunches'),
('Leg Raises', 'Core', ARRAY['core', 'hip_flexors'], 'bodyweight', 'isolation', 'intermediate', 'intermediate', false, 'Lying leg lifting movement'),

-- Cardio/Conditioning
('Jumping Jacks', 'Cardio', ARRAY['full_body'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Jump feet apart while raising arms overhead'),
('High Knees', 'Cardio', ARRAY['legs', 'core'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Running in place with high knee lifts'),
('Butt Kickers', 'Cardio', ARRAY['hamstrings', 'glutes'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Running in place kicking heels to glutes'),
('Bear Crawl', 'Strength', ARRAY['shoulders', 'core', 'legs'], 'bodyweight', 'carry', 'intermediate', 'intermediate', true, 'Crawl forward on hands and feet'),

-- Additional Isolation Exercises
('Calf Raises', 'Strength', ARRAY['calves'], 'bodyweight', 'isolation', 'beginner', 'beginner', false, 'Rise up on toes and lower slowly'),
('Lateral Raises', 'Strength', ARRAY['shoulders'], 'dumbbell', 'isolation', 'beginner', 'beginner', false, 'Raise arms out to sides at shoulder height'),
('Front Raises', 'Strength', ARRAY['shoulders'], 'dumbbell', 'isolation', 'beginner', 'beginner', false, 'Raise arms forward to shoulder height'),
('Tricep Extensions', 'Strength', ARRAY['triceps'], 'dumbbell', 'isolation', 'beginner', 'beginner', false, 'Extend arms overhead lowering weight behind head'),
('Chest Flyes', 'Strength', ARRAY['chest'], 'dumbbell', 'isolation', 'intermediate', 'intermediate', false, 'Fly arms open and together in arc motion'),

-- Barbell Exercises
('Barbell Squats', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'barbell', 'squat', 'intermediate', 'intermediate', true, 'Back squat with barbell on shoulders'),
('Barbell Deadlifts', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'hinge', 'intermediate', 'intermediate', true, 'Conventional deadlift from floor'),
('Barbell Rows', 'Strength', ARRAY['back', 'biceps'], 'barbell', 'pull_horizontal', 'intermediate', 'intermediate', true, 'Bent over barbell rowing'),
('Bench Press', 'Strength', ARRAY['chest', 'triceps', 'shoulders'], 'barbell', 'push_horizontal', 'intermediate', 'intermediate', true, 'Horizontal pressing from bench'),
('Overhead Press', 'Strength', ARRAY['shoulders', 'triceps'], 'barbell', 'push_vertical', 'intermediate', 'intermediate', true, 'Standing overhead barbell press'),

-- Machine/Cable Exercises  
('Lat Pulldowns', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_vertical', 'beginner', 'beginner', true, 'Seated cable pulling to chest'),
('Cable Rows', 'Strength', ARRAY['back', 'biceps'], 'cable', 'pull_horizontal', 'beginner', 'beginner', true, 'Seated cable rowing'),
('Leg Press', 'Strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'machine', 'squat', 'beginner', 'beginner', true, 'Machine-based leg pressing movement'),
('Leg Curls', 'Strength', ARRAY['hamstrings'], 'machine', 'isolation', 'beginner', 'beginner', false, 'Machine-based hamstring curls'),
('Leg Extensions', 'Strength', ARRAY['quadriceps'], 'machine', 'isolation', 'beginner', 'beginner', false, 'Machine-based quad extensions');