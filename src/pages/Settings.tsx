import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Dumbbell } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { BottomNav } from "@/components/BottomNav";
import { WorkoutProgramSelector } from "@/components/WorkoutProgramSelector";
import { ProgramModificationModal } from "@/components/ProgramModificationModal";
import { useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { PreferencesForm } from "@/components/forms/PreferencesForm";
import { NotificationForm } from "@/components/forms/NotificationForm";
import { AccountForm } from "@/components/forms/AccountForm";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showProgramGenerator, setShowProgramGenerator] = useState(false);
  const [showProgramModification, setShowProgramModification] = useState(false);
  const { activeProgram, userPreferences, loading, fetchActiveProgram } = useWorkoutProgram() as any;

  const handleProgramCreated = () => {
    setShowProgramGenerator(false);
    fetchActiveProgram?.();
  };

  const handleProgramUpdated = () => {
    setShowProgramModification(false);
    fetchActiveProgram?.();
  };

  const settingsContent = (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-fitness-primary" />
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and workout preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm />
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Workout Program
                </CardTitle>
                <CardDescription>Generate and manage your personalized training program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading workout program...</div>
                ) : activeProgram ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-fitness-primary/5 rounded-lg border border-fitness-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-fitness-primary">{activeProgram.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {activeProgram.sessions_per_week} sessions per week • {activeProgram.duration_weeks} weeks
                          </p>
                        </div>
                        <div className="space-y-2 text-right">
                          <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">Active</Badge>
                          <div className="text-xs text-muted-foreground">
                            {String(activeProgram.training_focus)?.charAt(0).toUpperCase() + String(activeProgram.training_focus)?.slice(1)} Focus
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Program Actions</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowProgramGenerator(true)} className="flex-1">Generate New Program</Button>
                        <Button variant="outline" onClick={() => setShowProgramModification(true)} className="flex-1">Modify Current Program</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="text-muted-foreground">
                      <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No Active Program</p>
                      <p className="text-sm">Create a personalized workout program to get started</p>
                    </div>
                    <Button onClick={() => setShowProgramGenerator(true)} className="bg-gradient-primary">Generate Workout Program</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment and Preferences */}
            <PreferencesForm />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <NotificationForm />
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4">
            <AccountForm />
          </TabsContent>
        </Tabs>

        {/* Workout Program Generator Modal */}
        {showProgramGenerator && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Generate Workout Program</h2>
                  <Button variant="ghost" onClick={() => setShowProgramGenerator(false)}>×</Button>
                </div>
                <WorkoutProgramSelector onProgramCreated={handleProgramCreated} />
              </div>
            </div>
          </div>
        )}

        {/* Program Modification Modal */}
        <ProgramModificationModal
          program={activeProgram}
          isOpen={showProgramModification}
          onClose={() => setShowProgramModification(false)}
          onProgramUpdated={handleProgramUpdated}
        />
      </main>

      <BottomNav />
    </div>
  );

  return <AuthGuard>{settingsContent}</AuthGuard>;
};

export default Settings;
