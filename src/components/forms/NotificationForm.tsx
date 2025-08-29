import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Save, Loader2, Clock, Trophy, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NotificationFormProps {
  initialData?: any;
  onSave?: () => void;
}

export const NotificationForm = ({ initialData, onSave }: NotificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    workout_reminders: initialData?.workout_reminders ?? true,
    reminder_time: initialData?.reminder_time || '09:00',
    progress_notifications: initialData?.progress_notifications ?? true,
    achievement_alerts: initialData?.achievement_alerts ?? true,
    weekly_summary: initialData?.weekly_summary ?? true,
    email_notifications: initialData?.email_notifications ?? false,
    push_notifications: initialData?.push_notifications ?? true,
    reminder_frequency: initialData?.reminder_frequency || 'daily'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save to a user_notification_preferences table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been successfully updated."
      });

      onSave?.();
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Workout Reminders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-base font-medium">Workout Reminders</Label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="workout_reminders">Enable workout reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified when it's time for your scheduled workout</p>
              </div>
              <Switch
                id="workout_reminders"
                checked={formData.workout_reminders}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, workout_reminders: checked }))}
              />
            </div>

            {formData.workout_reminders && (
              <div className="ml-6 space-y-4">
                <div className="space-y-2">
                  <Label>Reminder Time</Label>
                  <Select
                    value={formData.reminder_time}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, reminder_time: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reminder Frequency</Label>
                  <Select
                    value={formData.reminder_frequency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, reminder_frequency: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="workout_days">Only on workout days</SelectItem>
                      <SelectItem value="missed_workouts">Only when workouts are missed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Progress & Achievements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <Label className="text-base font-medium">Progress & Achievements</Label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="progress_notifications">Progress notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about your workout progress and milestones</p>
              </div>
              <Switch
                id="progress_notifications"
                checked={formData.progress_notifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, progress_notifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="achievement_alerts">Achievement alerts</Label>
                <p className="text-sm text-muted-foreground">Celebrate your fitness achievements and personal records</p>
              </div>
              <Switch
                id="achievement_alerts"
                checked={formData.achievement_alerts}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, achievement_alerts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekly_summary">Weekly summary</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of your workout activity</p>
              </div>
              <Switch
                id="weekly_summary"
                checked={formData.weekly_summary}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, weekly_summary: checked }))}
              />
            </div>
          </div>

          <Separator />

          {/* Communication Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label className="text-base font-medium">Communication Preferences</Label>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="push_notifications">Push notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications directly on your device</p>
              </div>
              <Switch
                id="push_notifications"
                checked={formData.push_notifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, push_notifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email_notifications">Email notifications</Label>
                <p className="text-sm text-muted-foreground">Receive important updates and summaries via email</p>
              </div>
              <Switch
                id="email_notifications"
                checked={formData.email_notifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, email_notifications: checked }))}
              />
            </div>
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
                Save Notification Preferences
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};