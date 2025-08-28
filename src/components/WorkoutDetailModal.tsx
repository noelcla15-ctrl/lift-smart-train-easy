import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, RotateCcw, Settings } from 'lucide-react';
import { GeneratedWorkout } from '@/hooks/useWorkoutGeneration';
import { useWorkoutProgram } from '@/hooks/useWorkoutProgram';
import { WorkoutGenerator } from '@/utils/workoutGenerator';
import { toast } from 'sonner';

interface WorkoutDetailModalProps {
  workout: GeneratedWorkout | null;
  isOpen: boolean;
  onClose: () => void;
}

const EQUIPMENT_OPTIONS = [
  'bodyweight',
  'dumbbell', 
  'barbell',
  'cable',
  'machine',
  'resistance_band',
  'kettlebell'
];

export const WorkoutDetailModal = ({ workout, isOpen, onClose }: WorkoutDetailModalProps) => {
  const { activeProgram, userPreferences } = useWorkoutProgram();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState(60);
  const [modifiedWorkout, setModifiedWorkout] = useState<GeneratedWorkout | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (workout) {
      setModifiedWorkout(workout);
      setWorkoutDuration(workout.estimatedDuration || 60);
    }
    if (userPreferences) {
      setSelectedEquipment(userPreferences.available_equipment || ['bodyweight', 'dumbbell']);
    }
  }, [workout, userPreferences]);

  const handleEquipmentChange = (equipment: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment) 
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const regenerateWorkout = async () => {
    if (!activeProgram) return;

    setIsRegenerating(true);
    try {
      const generator = new WorkoutGenerator();
      await generator.initialize();

      // Generate workout with modified parameters
      const params = {
        trainingExperience: 'intermediate' as const,
        trainingGoals: activeProgram.training_focus === 'hypertrophy' ? ['muscle_gain'] : ['strength'],
        weeklyAvailability: activeProgram.sessions_per_week,
        availableEquipment: selectedEquipment,
        dislikedExercises: userPreferences?.disliked_exercises || [],
        preferredDuration: workoutDuration,
        trainingFocus: activeProgram.training_focus as 'hypertrophy' | 'strength' | 'endurance' | 'general_fitness',
      };

      const program = await generator.generateProgram(params);
      const newWorkout = program[0];
      
      const generatedWorkout: GeneratedWorkout = {
        name: newWorkout.name,
        exercises: newWorkout.exercises.map(ex => ({
          id: crypto.randomUUID(),
          name: ex.exercise_name,
          sets: ex.sets,
          reps: typeof ex.reps === 'string' ? parseInt(ex.reps) : ex.reps,
          weight: ex.weight_kg ? Math.round(ex.weight_kg * 2.20462) : undefined,
          restTime: ex.rest_seconds,
          notes: ex.notes || '',
          exerciseId: ex.exercise_id,
        })),
        estimatedDuration: newWorkout.estimated_duration,
        difficulty: activeProgram.training_focus,
      };

      setModifiedWorkout(generatedWorkout);
      toast.success('Workout regenerated with new preferences!');
    } catch (error) {
      console.error('Error regenerating workout:', error);
      toast.error('Failed to regenerate workout');
    } finally {
      setIsRegenerating(false);
    }
  };

  const currentWorkout = modifiedWorkout || workout;

  if (!currentWorkout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {currentWorkout.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{currentWorkout.estimatedDuration} minutes</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Dumbbell className="h-4 w-4" />
                  <span>{currentWorkout.exercises.length} exercises</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <Badge variant="secondary">{currentWorkout.difficulty}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* One-time Modifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                One-Time Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Duration Adjustment */}
              <div className="space-y-2">
                <Label>Workout Duration (minutes)</Label>
                <Input
                  type="number"
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                  min={15}
                  max={180}
                  step={5}
                />
              </div>

              {/* Equipment Override */}
              <div className="space-y-2">
                <Label>Available Equipment (for today only)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EQUIPMENT_OPTIONS.map(equipment => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={selectedEquipment.includes(equipment)}
                        onCheckedChange={() => handleEquipmentChange(equipment)}
                      />
                      <Label
                        htmlFor={equipment}
                        className="text-sm font-normal capitalize"
                      >
                        {equipment.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={regenerateWorkout} 
                disabled={isRegenerating}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isRegenerating ? 'Regenerating...' : 'Apply Changes & Regenerate'}
              </Button>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight && ` @ ${exercise.weight} lbs`}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Rest: {Math.floor(exercise.restTime / 60)}:{(exercise.restTime % 60).toString().padStart(2, '0')} min
                        </div>
                        {exercise.notes && (
                          <div className="text-xs text-muted-foreground mt-1 italic">
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {index + 1}
                      </Badge>
                    </div>
                    {index < currentWorkout.exercises.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={() => {
              // TODO: Implement start workout functionality
              onClose();
              toast.success('Starting workout...');
            }} className="flex-1">
              Start This Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};