import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Dumbbell, Target, Clock, Zap } from 'lucide-react';
import { WorkoutGenerator, WorkoutGenerationParams } from '@/utils/workoutGenerator';
import { useWorkoutProgram } from '@/hooks/useWorkoutProgram';
import { toast } from 'sonner';

const EQUIPMENT_OPTIONS = [
  'bodyweight', 'dumbbells', 'barbells', 'kettlebells', 'resistance_bands',
  'pull_up_bar', 'bench', 'squat_rack', 'cable_machine', 'cardio_equipment'
];

const TRAINING_GOALS = [
  'strength', 'muscle_gain', 'weight_loss', 'endurance', 'general_fitness',
  'athletic_performance', 'flexibility', 'rehabilitation'
];

export const WorkoutProgramSelector = ({ onProgramCreated }: { onProgramCreated?: () => void }) => {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const { createProgram } = useWorkoutProgram();

  // Form state
  const [trainingExperience, setTrainingExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [trainingGoals, setTrainingGoals] = useState<string[]>(['general_fitness']);
  const [weeklyAvailability, setWeeklyAvailability] = useState(3);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(['bodyweight']);
  const [preferredDuration, setPreferredDuration] = useState(60);
  const [trainingFocus, setTrainingFocus] = useState<'strength' | 'hypertrophy' | 'endurance' | 'general_fitness'>('general_fitness');

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setAvailableEquipment(prev => [...prev, equipment]);
    } else {
      setAvailableEquipment(prev => prev.filter(e => e !== equipment));
    }
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setTrainingGoals(prev => [...prev, goal]);
    } else {
      setTrainingGoals(prev => prev.filter(g => g !== goal));
    }
  };

  const generateProgram = async () => {
    if (availableEquipment.length === 0) {
      toast.error('Please select at least one piece of equipment');
      return;
    }

    if (trainingGoals.length === 0) {
      toast.error('Please select at least one training goal');
      return;
    }

    setGenerating(true);

    try {
      const generator = new WorkoutGenerator();
      const params: WorkoutGenerationParams = {
        trainingExperience,
        trainingGoals,
        weeklyAvailability,
        availableEquipment,
        dislikedExercises: [], // Will be populated from user preferences later
        preferredDuration,
        trainingFocus
      };

      const workouts = await generator.generateProgram(params);
      
      // Determine program type based on sessions per week
      let programType: 'full_body' | 'upper_lower' | 'push_pull_legs' = 'full_body';
      if (weeklyAvailability === 4) programType = 'upper_lower';
      if (weeklyAvailability >= 5) programType = 'push_pull_legs';

      // Create the program in database
      await createProgram({
        name: `${trainingFocus.charAt(0).toUpperCase() + trainingFocus.slice(1)} Program`,
        program_type: programType,
        training_focus: trainingFocus,
        duration_weeks: 12,
        sessions_per_week: weeklyAvailability
      });

      toast.success('Workout program generated successfully!');
      onProgramCreated?.();
    } catch (error) {
      console.error('Error generating program:', error);
      toast.error('Failed to generate workout program');
    } finally {
      setGenerating(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-fitness-primary" />
          Training Assessment
        </CardTitle>
        <CardDescription>Tell us about your training experience and goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Training Experience</Label>
          <Select value={trainingExperience} onValueChange={(value: any) => setTrainingExperience(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
              <SelectItem value="intermediate">Intermediate (6-24 months)</SelectItem>
              <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Primary Training Focus</Label>
          <Select value={trainingFocus} onValueChange={(value: any) => setTrainingFocus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strength">Strength (Get stronger)</SelectItem>
              <SelectItem value="hypertrophy">Muscle Gain (Build muscle)</SelectItem>
              <SelectItem value="endurance">Endurance (Last longer)</SelectItem>
              <SelectItem value="general_fitness">General Fitness (Overall health)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Training Goals (select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3">
            {TRAINING_GOALS.map(goal => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={trainingGoals.includes(goal)}
                  onCheckedChange={(checked) => handleGoalChange(goal, !!checked)}
                />
                <Label htmlFor={goal} className="text-sm capitalize">
                  {goal.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => setStep(2)} className="w-full">
          Next: Equipment & Schedule
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-fitness-primary" />
          Equipment & Schedule
        </CardTitle>
        <CardDescription>What equipment do you have access to and how often can you train?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Days per week you can train</Label>
          <div className="px-3">
            <Slider
              value={[weeklyAvailability]}
              onValueChange={(value) => setWeeklyAvailability(value[0])}
              max={6}
              min={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>2 days</span>
              <span className="font-medium">{weeklyAvailability} days</span>
              <span>6 days</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Preferred workout duration</Label>
          <div className="px-3">
            <Slider
              value={[preferredDuration]}
              onValueChange={(value) => setPreferredDuration(value[0])}
              max={120}
              min={30}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>30 min</span>
              <span className="font-medium">{preferredDuration} min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Available Equipment</Label>
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map(equipment => (
              <div key={equipment} className="flex items-center space-x-2">
                <Checkbox
                  id={equipment}
                  checked={availableEquipment.includes(equipment)}
                  onCheckedChange={(checked) => handleEquipmentChange(equipment, !!checked)}
                />
                <Label htmlFor={equipment} className="text-sm capitalize">
                  {equipment.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button onClick={() => setStep(3)} className="flex-1">
            Review & Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => {
    const getProgramType = () => {
      if (weeklyAvailability <= 3) return 'Full Body';
      if (weeklyAvailability === 4) return 'Upper/Lower Split';
      return 'Push/Pull/Legs';
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-fitness-primary" />
            Program Summary
          </CardTitle>
          <CardDescription>Review your program details before generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Experience Level</Label>
              <Badge variant="secondary" className="capitalize">
                {trainingExperience}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Training Focus</Label>
              <Badge variant="secondary" className="capitalize">
                {trainingFocus.replace('_', ' ')}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Program Type</Label>
              <Badge variant="secondary">
                {getProgramType()}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Sessions/Week</Label>
              <Badge variant="secondary">
                {weeklyAvailability} days
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Training Goals</Label>
            <div className="flex flex-wrap gap-1">
              {trainingGoals.map(goal => (
                <Badge key={goal} variant="outline" className="text-xs capitalize">
                  {goal.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Available Equipment</Label>
            <div className="flex flex-wrap gap-1">
              {availableEquipment.map(equipment => (
                <Badge key={equipment} variant="outline" className="text-xs capitalize">
                  {equipment.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2 p-3 bg-fitness-primary/5 rounded-lg border border-fitness-primary/20">
            <Clock className="h-4 w-4 text-fitness-primary" />
            <div className="text-sm">
              <span className="font-medium">Estimated Duration:</span> ~{preferredDuration} minutes per session
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={generateProgram} 
              disabled={generating}
              className="flex-1 bg-gradient-primary"
            >
              {generating ? 'Generating...' : 'Generate Program'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};