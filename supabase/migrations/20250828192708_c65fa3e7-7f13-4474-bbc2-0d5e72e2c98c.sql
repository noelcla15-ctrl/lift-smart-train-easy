-- First, drop the existing movement_pattern constraint
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_movement_pattern_check;

-- Add new constraint that includes all existing movement patterns plus new ones
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_pattern_check 
CHECK (movement_pattern IN (
    -- Existing movement patterns
    'squat', 'hinge', 'lunge', 'carry', 'rotation', 'isolation',
    'push_horizontal', 'push_vertical', 'pull_horizontal', 'pull_vertical',
    -- Additional patterns for flexibility
    'push', 'pull', 'loaded_carry', 'anti_extension', 'anti_flexion', 'anti_rotation', 
    'flexion', 'extension', 'lateral_flexion', 'horizontal_push', 'horizontal_pull', 
    'vertical_push', 'vertical_pull', 'hip_hinge', 'knee_dominant', 'hip_dominant', 
    'single_leg', 'unilateral', 'bilateral', 'isometric',
    -- Warm-up movement patterns
    'shoulder_mobility', 'hip_mobility', 'spinal_mobility', 'ankle_mobility', 'wrist_mobility',
    'hip_extension', 'general_movement',
    -- Cool-down movement patterns  
    'chest_stretch', 'shoulder_stretch', 'tricep_stretch', 'quad_stretch', 'hamstring_stretch',
    'calf_stretch', 'hip_flexor_stretch', 'hip_stretch', 'spinal_stretch', 'lat_stretch',
    'adductor_stretch', 'IT_band_stretch', 'neck_stretch', 'back_stretch', 'glute_stretch',
    'posterior_chain_stretch', 'wrist_stretch', 'breathing'
));

-- Insert warm-up and cool-down exercises
INSERT INTO exercises (name, category, muscle_groups, equipment, movement_pattern, difficulty_level, is_compound, instructions, experience_level) VALUES
-- Warm-up exercises
('Arm Circles', 'warm_up', ARRAY['shoulders'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Stand with arms extended to sides. Make small circles forward for 10 reps, then backward for 10 reps.', 'beginner'),
('Leg Swings - Forward/Back', 'warm_up', ARRAY['hip_flexors', 'hamstrings'], 'bodyweight', 'hip_mobility', 'beginner', false, 'Hold wall for support. Swing one leg forward and back in controlled motion. 10 reps each leg.', 'beginner'),
('Hip Circles', 'warm_up', ARRAY['hip_flexors', 'glutes'], 'bodyweight', 'hip_mobility', 'beginner', false, 'Hands on hips, make large circles with hips. 10 circles each direction.', 'beginner'),
('Torso Twists', 'warm_up', ARRAY['obliques', 'core'], 'bodyweight', 'spinal_mobility', 'beginner', false, 'Stand with arms crossed. Rotate torso left and right while keeping hips facing forward.', 'beginner'),
('Glute Bridges', 'warm_up', ARRAY['glutes', 'hamstrings'], 'bodyweight', 'hip_extension', 'beginner', true, 'Lie on back, knees bent. Lift hips up squeezing glutes. Hold 2 seconds, lower. 10-15 reps.', 'beginner'),
('Wall Slides', 'warm_up', ARRAY['lats', 'rear_delts'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Back against wall, arms in goal post position. Slide arms up and down wall. 10 reps.', 'beginner'),
('Cat-Cow Stretch', 'warm_up', ARRAY['core', 'erector_spinae'], 'bodyweight', 'spinal_mobility', 'beginner', false, 'On hands and knees, arch and round back alternately. Move slowly through full range.', 'beginner'),
('Bodyweight Squats', 'warm_up', ARRAY['quadriceps', 'glutes'], 'bodyweight', 'squat', 'beginner', true, 'Light bodyweight squats focusing on movement quality and range of motion. 10-15 reps.', 'beginner'),
('Marching in Place', 'warm_up', ARRAY['hip_flexors', 'core'], 'bodyweight', 'general_movement', 'beginner', false, 'Lift knees up toward chest alternating legs. Start slow, increase pace. 30 seconds.', 'beginner'),
('Shoulder Rolls', 'warm_up', ARRAY['shoulders', 'upper_traps'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Roll shoulders backward in large circles. 10 rolls backward, 10 forward.', 'beginner'),

-- Cool-down exercises
('Chest Stretch', 'cool_down', ARRAY['chest', 'front_delts'], 'bodyweight', 'chest_stretch', 'beginner', false, 'Place forearm on wall, step forward and lean into stretch. Hold 30 seconds each arm.', 'beginner'),
('Shoulder Cross-Body Stretch', 'cool_down', ARRAY['rear_delts', 'shoulders'], 'bodyweight', 'shoulder_stretch', 'beginner', false, 'Pull arm across body with opposite hand. Hold 30 seconds each arm.', 'beginner'),
('Tricep Overhead Stretch', 'cool_down', ARRAY['triceps'], 'bodyweight', 'tricep_stretch', 'beginner', false, 'Reach one arm overhead, bend elbow, pull with other hand. Hold 30 seconds each arm.', 'beginner'),
('Quad Stretch', 'cool_down', ARRAY['quadriceps'], 'bodyweight', 'quad_stretch', 'beginner', false, 'Pull heel toward glutes, hold ankle. Use wall for balance. Hold 30 seconds each leg.', 'beginner'),
('Hamstring Stretch', 'cool_down', ARRAY['hamstrings'], 'bodyweight', 'hamstring_stretch', 'beginner', false, 'Sit with one leg extended, reach toward toes. Hold 30 seconds each leg.', 'beginner'),
('Calf Stretch', 'cool_down', ARRAY['calves'], 'bodyweight', 'calf_stretch', 'beginner', false, 'Step back, press heel down, lean forward. Hold 30 seconds each leg.', 'beginner'),
('Hip Flexor Stretch', 'cool_down', ARRAY['hip_flexors'], 'bodyweight', 'hip_flexor_stretch', 'beginner', false, 'Lunge position, push hips forward. Hold 30 seconds each leg.', 'beginner'),
('Pigeon Stretch', 'cool_down', ARRAY['hip_flexors', 'glutes'], 'bodyweight', 'hip_stretch', 'beginner', false, 'Seated with ankle on opposite knee, lean forward gently. Hold 30 seconds each side.', 'beginner'),
('Spinal Twist', 'cool_down', ARRAY['obliques', 'lower_back'], 'bodyweight', 'spinal_stretch', 'beginner', false, 'Sit with legs extended, cross one leg over, twist toward bent knee. Hold 30 seconds each side.', 'beginner'),
('Child''s Pose', 'cool_down', ARRAY['lats', 'lower_back'], 'bodyweight', 'back_stretch', 'beginner', false, 'Kneel and sit back on heels, reach arms forward, relax. Hold 30-60 seconds.', 'beginner');

-- Update user_preferences table to include warm-up and cool-down options
ALTER TABLE user_preferences 
ADD COLUMN include_warmup boolean DEFAULT true,
ADD COLUMN include_cooldown boolean DEFAULT true,
ADD COLUMN warmup_duration_minutes integer DEFAULT 8,
ADD COLUMN cooldown_duration_minutes integer DEFAULT 8;