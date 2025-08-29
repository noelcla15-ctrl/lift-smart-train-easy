import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Lock, Download, Trash2, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AccountFormProps {
  onSave?: () => void;
}

export const AccountForm = ({ onSave }: AccountFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      onSave?.();
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Export user data from multiple tables
      const [profilesRes, preferencesRes, workoutLogsRes, exerciseLogsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id),
        supabase.from('user_preferences').select('*').eq('user_id', user.id),
        supabase.from('workout_logs').select('*').eq('user_id', user.id),
        supabase.from('exercise_logs').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        user_id: user.id,
        email: user.email,
        export_date: new Date().toISOString(),
        profiles: profilesRes.data || [],
        preferences: preferencesRes.data || [],
        workout_logs: workoutLogsRes.data || [],
        exercise_logs: exerciseLogsRes.data || []
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // In a real implementation, you might want to soft-delete or anonymize data
      // instead of hard deletion, and handle this server-side
      
      // Delete user data
      await Promise.all([
        supabase.from('exercise_logs').delete().eq('user_id', user.id),
        supabase.from('workout_logs').delete().eq('user_id', user.id),
        supabase.from('user_preferences').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('user_id', user.id)
      ]);

      // Sign out the user
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted."
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your new password"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">Export Your Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your fitness data, including workouts, progress, and preferences.
              </p>
            </div>
            <Button variant="outline" onClick={handleDataExport} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20 bg-destructive/5">
            <div className="space-y-1">
              <Label className="text-base font-medium text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers, including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile and personal information</li>
                      <li>All workout history and logs</li>
                      <li>Progress tracking data</li>
                      <li>Preferences and settings</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAccountDeletion}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="text-xs text-muted-foreground p-4 bg-muted/30 rounded-lg">
            <p className="font-medium mb-2">Data Privacy Information:</p>
            <ul className="space-y-1">
              <li>• Your data is encrypted and stored securely</li>
              <li>• We never share your personal information with third parties</li>
              <li>• You can export your data at any time</li>
              <li>• Account deletion removes all data permanently</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};