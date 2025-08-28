-- First, drop the existing movement_pattern constraint
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_movement_pattern_check;

-- Add new constraint that includes warm-up and cool-down movement patterns
ALTER TABLE exercises ADD CONSTRAINT exercises_movement_pattern_check 
CHECK (movement_pattern IN (
    'squat', 'hinge', 'push', 'pull', 'lunge', 'carry', 'loaded_carry', 'anti_extension', 
    'anti_flexion', 'anti_rotation', 'rotation', 'flexion', 'extension', 'lateral_flexion',
    'horizontal_push', 'horizontal_pull', 'vertical_push', 'vertical_pull', 'hip_hinge',
    'knee_dominant', 'hip_dominant', 'single_leg', 'unilateral', 'bilateral', 'isometric',
    -- Warm-up movement patterns
    'shoulder_mobility', 'hip_mobility', 'spinal_mobility', 'ankle_mobility', 'wrist_mobility',
    'hip_extension', 'general_movement',
    -- Cool-down movement patterns  
    'chest_stretch', 'shoulder_stretch', 'tricep_stretch', 'quad_stretch', 'hamstring_stretch',
    'calf_stretch', 'hip_flexor_stretch', 'hip_stretch', 'spinal_stretch', 'lat_stretch',
    'adductor_stretch', 'IT_band_stretch', 'neck_stretch', 'back_stretch', 'glute_stretch',
    'posterior_chain_stretch', 'wrist_stretch', 'breathing'
));

-- Now insert the warm-up and cool-down exercises
INSERT INTO exercises (name, category, muscle_groups, equipment, movement_pattern, difficulty_level, is_compound, instructions, experience_level) VALUES
-- Warm-up exercises (dynamic movements and activation)
('Arm Circles', 'warm_up', ARRAY['shoulders'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Stand with arms extended to sides. Make small circles forward for 10 reps, then backward for 10 reps.', 'beginner'),
('Leg Swings - Forward/Back', 'warm_up', ARRAY['hip_flexors', 'hamstrings'], 'bodyweight', 'hip_mobility', 'beginner', false, 'Hold wall for support. Swing one leg forward and back in controlled motion. 10 reps each leg.', 'beginner'),
('Leg Swings - Side to Side', 'warm_up', ARRAY['abductors', 'adductors'], 'bodyweight', 'hip_mobility', 'beginner', false, 'Hold wall for support. Swing one leg side to side across body. 10 reps each leg.', 'beginner'),
('Hip Circles', 'warm_up', ARRAY['hip_flexors', 'glutes'], 'bodyweight', 'hip_mobility', 'beginner', false, 'Hands on hips, make large circles with hips. 10 circles each direction.', 'beginner'),
('Torso Twists', 'warm_up', ARRAY['obliques', 'core'], 'bodyweight', 'spinal_mobility', 'beginner', false, 'Stand with arms crossed. Rotate torso left and right while keeping hips facing forward.', 'beginner'),
('Glute Bridges', 'warm_up', ARRAY['glutes', 'hamstrings'], 'bodyweight', 'hip_extension', 'beginner', true, 'Lie on back, knees bent. Lift hips up squeezing glutes. Hold 2 seconds, lower. 10-15 reps.', 'beginner'),
('Band Pull-Aparts', 'warm_up', ARRAY['rear_delts', 'rhomboids'], 'resistance_band', 'horizontal_pull', 'beginner', false, 'Hold band at chest level. Pull apart squeezing shoulder blades together. 15 reps.', 'beginner'),
('Wall Slides', 'warm_up', ARRAY['lats', 'rear_delts'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Back against wall, arms in goal post position. Slide arms up and down wall. 10 reps.', 'beginner'),
('Cat-Cow Stretch', 'warm_up', ARRAY['core', 'erector_spinae'], 'bodyweight', 'spinal_mobility', 'beginner', false, 'On hands and knees, arch and round back alternately. Move slowly through full range.', 'beginner'),
('Bodyweight Squats', 'warm_up', ARRAY['quadriceps', 'glutes'], 'bodyweight', 'squat', 'beginner', true, 'Light bodyweight squats focusing on movement quality and range of motion. 10-15 reps.', 'beginner'),
('Marching in Place', 'warm_up', ARRAY['hip_flexors', 'core'], 'bodyweight', 'general_movement', 'beginner', false, 'Lift knees up toward chest alternating legs. Start slow, increase pace. 30 seconds.', 'beginner'),
('Shoulder Rolls', 'warm_up', ARRAY['shoulders', 'upper_traps'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Roll shoulders backward in large circles. 10 rolls backward, 10 forward.', 'beginner'),
('Ankle Circles', 'warm_up', ARRAY['calves'], 'bodyweight', 'ankle_mobility', 'beginner', false, 'Lift one foot, make circles with ankle. 10 each direction, each foot.', 'beginner'),
('Knee Lifts', 'warm_up', ARRAY['hip_flexors', 'core'], 'bodyweight', 'general_movement', 'beginner', false, 'Lift knees alternately toward chest while standing. Moderate pace. 20 total.', 'beginner'),
('Wrist Circles', 'warm_up', ARRAY['forearms'], 'bodyweight', 'wrist_mobility', 'beginner', false, 'Extend arms, make circles with wrists. 10 each direction.', 'beginner'),
('Light Lunges', 'warm_up', ARRAY['quadriceps', 'glutes', 'hip_flexors'], 'bodyweight', 'lunge', 'beginner', true, 'Step forward into light lunge, focus on mobility and activation. 8 each leg.', 'beginner'),
('Arm Swings', 'warm_up', ARRAY['shoulders', 'chest'], 'bodyweight', 'shoulder_mobility', 'beginner', false, 'Swing arms across body and open wide. Controlled movement. 15 reps.', 'beginner'),
('Side Bends', 'warm_up', ARRAY['obliques', 'lats'], 'bodyweight', 'lateral_flexion', 'beginner', false, 'Stand tall, bend to one side reaching arm overhead. Alternate sides. 10 each.', 'beginner'),
('Heel Walks', 'warm_up', ARRAY['tibialis_anterior', 'calves'], 'bodyweight', 'ankle_mobility', 'beginner', false, 'Walk on heels with toes lifted up. 20 steps forward.', 'beginner'),
('Butt Kicks', 'warm_up', ARRAY['hamstrings', 'quadriceps'], 'bodyweight', 'general_movement', 'beginner', false, 'Jog in place bringing heels toward glutes. Light pace. 20 total.', 'beginner'),

-- Cool-down exercises (static stretches and recovery)
('Chest Stretch', 'cool_down', ARRAY['chest', 'front_delts'], 'bodyweight', 'chest_stretch', 'beginner', false, 'Place forearm on wall, step forward and lean into stretch. Hold 30 seconds each arm.', 'beginner'),
('Shoulder Cross-Body Stretch', 'cool_down', ARRAY['rear_delts', 'shoulders'], 'bodyweight', 'shoulder_stretch', 'beginner', false, 'Pull arm across body with opposite hand. Hold 30 seconds each arm.', 'beginner'),
('Tricep Overhead Stretch', 'cool_down', ARRAY['triceps'], 'bodyweight', 'tricep_stretch', 'beginner', false, 'Reach one arm overhead, bend elbow, pull with other hand. Hold 30 seconds each arm.', 'beginner'),
('Quad Stretch', 'cool_down', ARRAY['quadriceps'], 'bodyweight', 'quad_stretch', 'beginner', false, 'Pull heel toward glutes, hold ankle. Use wall for balance. Hold 30 seconds each leg.', 'beginner'),
('Hamstring Stretch', 'cool_down', ARRAY['hamstrings'], 'bodyweight', 'hamstring_stretch', 'beginner', false, 'Sit with one leg extended, reach toward toes. Hold 30 seconds each leg.', 'beginner'),
('Calf Stretch', 'cool_down', ARRAY['calves'], 'bodyweight', 'calf_stretch', 'beginner', false, 'Step back, press heel down, lean forward. Hold 30 seconds each leg.', 'beginner'),
('Hip Flexor Stretch', 'cool_down', ARRAY['hip_flexors'], 'bodyweight', 'hip_flexor_stretch', 'beginner', false, 'Lunge position, push hips forward. Hold 30 seconds each leg.', 'beginner'),
('Pigeon Stretch', 'cool_down', ARRAY['hip_flexors', 'glutes'], 'bodyweight', 'hip_stretch', 'beginner', false, 'Seated with ankle on opposite knee, lean forward gently. Hold 30 seconds each side.', 'beginner'),
('Spinal Twist', 'cool_down', ARRAY['obliques', 'lower_back'], 'bodyweight', 'spinal_stretch', 'beginner', false, 'Sit with legs extended, cross one leg over, twist toward bent knee. Hold 30 seconds each side.', 'beginner'),
('Cat Stretch', 'cool_down', ARRAY['lats', 'core'], 'bodyweight', 'lat_stretch', 'beginner', false, 'On hands and knees, sit back toward heels, reach arms forward. Hold 30 seconds.', 'beginner'),
('Cobra Stretch', 'cool_down', ARRAY['hip_flexors', 'core'], 'bodyweight', 'hip_flexor_stretch', 'beginner', false, 'Lie face down, press up with arms, arch back gently. Hold 20 seconds.', 'beginner'),
('Butterfly Stretch', 'cool_down', ARRAY['adductors', 'hip_flexors'], 'bodyweight', 'adductor_stretch', 'beginner', false, 'Sit with soles of feet together, gently press knees down. Hold 30 seconds.', 'beginner'),
('IT Band Stretch', 'cool_down', ARRAY['IT_band', 'hip_abductors'], 'bodyweight', 'IT_band_stretch', 'beginner', false, 'Cross legs, lean away from back leg. Hold 30 seconds each side.', 'beginner'),
('Neck Stretch', 'cool_down', ARRAY['neck', 'upper_traps'], 'bodyweight', 'neck_stretch', 'beginner', false, 'Tilt head to side, gently pull with hand. Hold 20 seconds each side.', 'beginner'),
('Child''s Pose', 'cool_down', ARRAY['lats', 'lower_back'], 'bodyweight', 'back_stretch', 'beginner', false, 'Kneel and sit back on heels, reach arms forward, relax. Hold 30-60 seconds.', 'beginner'),
('Figure-4 Stretch', 'cool_down', ARRAY['glutes', 'hip_external_rotators'], 'bodyweight', 'glute_stretch', 'beginner', false, 'Lie on back, ankle on opposite knee, pull thigh toward chest. Hold 30 seconds each side.', 'beginner'),
('Standing Forward Fold', 'cool_down', ARRAY['hamstrings', 'calves', 'lower_back'], 'bodyweight', 'posterior_chain_stretch', 'beginner', false, 'Stand and fold forward, let arms hang loose. Hold 30 seconds.', 'beginner'),
('Lat Stretch', 'cool_down', ARRAY['lats'], 'bodyweight', 'lat_stretch', 'beginner', false, 'Reach one arm overhead and lean to opposite side. Hold 30 seconds each side.', 'beginner'),
('Wrist Flexor Stretch', 'cool_down', ARRAY['forearms'], 'bodyweight', 'wrist_stretch', 'beginner', false, 'Extend arm, pull fingers back with other hand. Hold 20 seconds each arm.', 'beginner'),
('Deep Breathing', 'cool_down', ARRAY['diaphragm'], 'bodyweight', 'breathing', 'beginner', false, 'Lie comfortably, breathe deeply into belly. 4 counts in, 6 counts out. 5 minutes.', 'beginner');

-- Update user_preferences table to include warm-up and cool-down options
ALTER TABLE user_preferences 
ADD COLUMN include_warmup boolean DEFAULT true,
ADD COLUMN include_cooldown boolean DEFAULT true,
ADD COLUMN warmup_duration_minutes integer DEFAULT 8,
ADD COLUMN cooldown_duration_minutes integer DEFAULT 8;