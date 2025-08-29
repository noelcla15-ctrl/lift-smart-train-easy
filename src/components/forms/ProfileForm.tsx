import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ProfileFormProps {
  initialData?: any;
  onSave?: () => void;
}

const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-6 months)' },
  { value: 'intermediate', label: 'Intermediate (6 months - 2 years)' },
  { value: 'advanced', label: 'Advanced (2+ years)' }
];

const TRAINING_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'general_fitness', label: 'General Fitness' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'athletic_performance', label: 'Athletic Performance' }
];

const INJURY_OPTIONS = [
  { value: 'back_injury', label: 'Back Injury' },
  { value: 'knee_injury', label: 'Knee Injury' },
  { value: 'shoulder_injury', label: 'Shoulder Injury' },
  { value: 'wrist_injury', label: 'Wrist Injury' },
  { value: 'ankle_injury', label: 'Ankle Injury' },
  { value: 'hip_injury', label: 'Hip Injury' },
  { value: 'other', label: 'Other' }
];

export const ProfileForm = ({ initialData, onSave }: ProfileFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || '',
    avatar_url: initialData?.avatar_url || '',
    fitness_level: initialData?.fitness_level || '',
    training_experience: initialData?.training_experience || '',
    training_goals: initialData?.training_goals || [],
    injury_history: initialData?.injury_history || [],
    weekly_availability: initialData?.weekly_availability || 3,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });

      onSave?.();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      training_goals: prev.training_goals.includes(goal)
        ? prev.training_goals.filter(g => g !== goal)
        : [...prev.training_goals, goal]
    }));
  };

  const handleInjuryToggle = (injury: string) => {
    setFormData(prev => ({
      ...prev,
      injury_history: prev.injury_history.includes(injury)
        ? prev.injury_history.filter(i => i !== injury)
        : [...prev.injury_history, injury]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar and Display Name */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback>
                {formData.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="Enter your display name"
              />
            </div>
          </div>

          {/* Fitness Level */}
          <div className="space-y-2">
            <Label>Fitness Level</Label>
            <Select
              value={formData.fitness_level}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_level: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your fitness level" />
              </SelectTrigger>
              <SelectContent>
                {FITNESS_LEVELS.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Training Experience */}
          <div className="space-y-2">
            <Label htmlFor="training_experience">Training Experience</Label>
            <Textarea
              id="training_experience"
              value={formData.training_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, training_experience: e.target.value }))}
              placeholder="Describe your training background (sports, previous programs, etc.)"
              rows={3}
            />
          </div>

          {/* Weekly Availability */}
          <div className="space-y-2">
            <Label htmlFor="weekly_availability">Weekly Availability (days per week)</Label>
            <Select
              value={formData.weekly_availability.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weekly_availability: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map(days => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} day{days > 1 ? 's' : ''} per week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Training Goals */}
          <div className="space-y-3">
            <Label>Training Goals</Label>
            <div className="grid grid-cols-2 gap-3">
              {TRAINING_GOALS.map(goal => (
                <div key={goal.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal.value}
                    checked={formData.training_goals.includes(goal.value)}
                    onCheckedChange={() => handleGoalToggle(goal.value)}
                  />
                  <Label htmlFor={goal.value} className="text-sm font-normal">
                    {goal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Injury History */}
          <div className="space-y-3">
            <Label>Injury History (optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              {INJURY_OPTIONS.map(injury => (
                <div key={injury.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={injury.value}
                    checked={formData.injury_history.includes(injury.value)}
                    onCheckedChange={() => handleInjuryToggle(injury.value)}
                  />
                  <Label htmlFor={injury.value} className="text-sm font-normal">
                    {injury.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};