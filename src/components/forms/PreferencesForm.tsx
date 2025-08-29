import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Loader2, Dumbbell, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PreferencesFormProps {
  initialData?: any;
  onSave?: () => void;
}

const EQUIPMENT_OPTIONS = [
  { value: 'bodyweight', label: 'Bodyweight', icon: '🏃‍♂️' },
  { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️‍♀️' },
  { value: 'barbell', label: 'Barbell', icon: '🏋️‍♂️' },
  { value: 'kettlebells', label: 'Kettlebells', icon: '⚖️' },
  { value: 'resistance_bands', label: 'Resistance Bands', icon: '🎯' },
  { value: 'pull_up_bar', label: 'Pull-up Bar', icon: '🆙' },
  { value: 'bench', label: 'Bench', icon: '🪑' },
  { value: 'squat_rack', label: 'Squat Rack', icon: '🏗️' },
  { value: 'cable_machine', label: 'Cable Machine', icon: '🎪' },
  { value: 'cardio_equipment', label: 'Cardio Equipment', icon: '🏃‍♀️' }
];

export const PreferencesForm = ({ initialData, onSave }: PreferencesFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    available_equipment: initialData?.available_equipment || ['bodyweight'],
    preferred_workout_duration: initialData?.preferred_workout_duration || 60,
    preferred_rest_between_sets: initialData?.preferred_rest_between_sets || 90,
    include_warmup: initialData?.include_warmup ?? true,
    include_cooldown: initialData?.include_cooldown ?? true,
    warmup_duration_minutes: initialData?.warmup_duration_minutes || 8,
    cooldown_duration_minutes: initialData?.cooldown_duration_minutes || 8,
    auto_progress_enabled: initialData?.auto_progress_enabled ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Preferences Updated",
        description: "Your workout preferences have been successfully updated."
      });

      onSave?.();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      available_equipment: prev.available_equipment.includes(equipment)
        ? prev.available_equipment.filter(e => e !== equipment)
        : [...prev.available_equipment, equipment]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Workout Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Available Equipment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <Label className="text-base font-medium">Available Equipment</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EQUIPMENT_OPTIONS.map(equipment => (
                <div key={equipment.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={equipment.value}
                    checked={formData.available_equipment.includes(equipment.value)}
                    onCheckedChange={() => handleEquipmentToggle(equipment.value)}
                  />
                  <Label htmlFor={equipment.value} className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                    <span>{equipment.icon}</span>
                    {equipment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Workout Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-base font-medium">Preferred Workout Duration</Label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{formData.preferred_workout_duration} minutes</span>
              </div>
              <Slider
                value={[formData.preferred_workout_duration]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_workout_duration: value[0] }))}
                min={20}
                max={120}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20 min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>

          {/* Rest Between Sets */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <Label className="text-base font-medium">Rest Between Sets</Label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rest Time</span>
                <span className="font-medium">{formData.preferred_rest_between_sets} seconds</span>
              </div>
              <Slider
                value={[formData.preferred_rest_between_sets]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_rest_between_sets: value[0] }))}
                min={30}
                max={300}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30s</span>
                <span>5 min</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Warmup and Cooldown */}
          <div className="space-y-6">
            <Label className="text-base font-medium">Warmup & Cooldown</Label>
            
            {/* Include Warmup */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="include_warmup">Include Warmup</Label>
                <p className="text-sm text-muted-foreground">Add dynamic warmup exercises to your workouts</p>
              </div>
              <Switch
                id="include_warmup"
                checked={formData.include_warmup}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, include_warmup: checked }))}
              />
            </div>

            {/* Warmup Duration */}
            {formData.include_warmup && (
              <div className="ml-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Warmup Duration</span>
                  <span className="font-medium">{formData.warmup_duration_minutes} minutes</span>
                </div>
                <Slider
                  value={[formData.warmup_duration_minutes]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, warmup_duration_minutes: value[0] }))}
                  min={5}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {/* Include Cooldown */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="include_cooldown">Include Cooldown</Label>
                <p className="text-sm text-muted-foreground">Add stretching and mobility exercises</p>
              </div>
              <Switch
                id="include_cooldown"
                checked={formData.include_cooldown}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, include_cooldown: checked }))}
              />
            </div>

            {/* Cooldown Duration */}
            {formData.include_cooldown && (
              <div className="ml-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cooldown Duration</span>
                  <span className="font-medium">{formData.cooldown_duration_minutes} minutes</span>
                </div>
                <Slider
                  value={[formData.cooldown_duration_minutes]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cooldown_duration_minutes: value[0] }))}
                  min={5}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Auto Progress */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto_progress">Auto Progress</Label>
              <p className="text-sm text-muted-foreground">Automatically increase weights and reps based on performance</p>
            </div>
            <Switch
              id="auto_progress"
              checked={formData.auto_progress_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_progress_enabled: checked }))}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Preferences...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};