import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Dumbbell, Bell, Shield } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { BottomNav } from '@/components/BottomNav';
import { WorkoutProgramSelector } from '@/components/WorkoutProgramSelector';
import { ProgramModificationModal } from '@/components/ProgramModificationModal';
import { useWorkoutProgram } from '@/hooks/useWorkoutProgram';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { PreferencesForm } from '@/components/forms/PreferencesForm';
import { NotificationForm } from '@/components/forms/NotificationForm';
import { AccountForm } from '@/components/forms/AccountForm';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showProgramGenerator, setShowProgramGenerator] = useState(false);
  const [showProgramModification, setShowProgramModification] = useState(false);
  const { activeProgram, userPreferences, loading, fetchActiveProgram } = useWorkoutProgram();

  const handleProgramCreated = () => {
    setShowProgramGenerator(false);
    fetchActiveProgram();
  };

  const handleProgramUpdated = () => {
    setShowProgramModification(false);
    fetchActiveProgram();
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
          import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function ProfileForm() {
  const { user, updateUser } = useAuth() as any; // updateUser optional in some setups
  const [form, setForm] = useState({
    displayName: "",
    age: "",
    heightCm: "",
    weightKg: "",
    gender: "prefer_not",
    experience: "beginner",
  });

  // hydrate from localStorage and user metadata
  useEffect(() => {
    const local = localStorage.getItem("profile");
    if (local) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(local) })); } catch {}
    }
    if (user) {
      setForm(prev => ({
        ...prev,
        displayName: prev.displayName || user.user_metadata?.full_name || user.email || "",
      }));
    }
  }, [user]);

  const onChange = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }));

  const onSave = async () => {
    localStorage.setItem("profile", JSON.stringify(form));
    try {
      if (updateUser) {
        await updateUser({ data: { full_name: form.displayName, gender: form.gender, experience: form.experience } });
      }
      toast({ title: "Profile saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message ?? "Unknown error" });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your basic info for personalization</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" value={form.displayName} onChange={e => onChange("displayName", e.target.value)} placeholder="e.g., Noel" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" inputMode="numeric" value={form.age} onChange={e => onChange("age", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input id="height" inputMode="numeric" value={form.heightCm} onChange={e => onChange("heightCm", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" inputMode="numeric" value={form.weightKg} onChange={e => onChange("weightKg", e.target.value)} />
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={v => onChange("gender", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="prefer_not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Experience</Label>
          <Select value={form.experience} onValueChange={v => onChange("experience", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Button onClick={onSave} className="bg-gradient-primary w-full md:w-auto">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}


          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Workout Program
                </CardTitle>
                <CardDescription>
                  Generate and manage your personalized training program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading workout program...
                  </div>
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
                        <div className="space-y-2">
                          <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
                            Active
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {activeProgram.training_focus.charAt(0).toUpperCase() + activeProgram.training_focus.slice(1)} Focus
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Program Actions</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowProgramGenerator(true)}
                          className="flex-1"
                        >
                          Generate New Program
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowProgramModification(true)}
                        >
                          Modify Current Program
                        </Button>
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
                    <Button 
                      onClick={() => setShowProgramGenerator(true)}
                      className="bg-gradient-primary"
                    >
                      Generate Workout Program
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment and Preferences */}
           import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { toast } from "@/hooks/use-toast";

export function PreferencesForm() {
  const { userPreferences } = useWorkoutProgram() as any;
  const [form, setForm] = useState({
    daysPerWeek: 3,
    goal: "hypertrophy",
    typicalSessionMin: 60,
    equipment: {
      bodyweight: true,
      dumbbells: true,
      barbell: false,
      machines: false,
      bands: false,
    },
    injuries: "",
  });

  useEffect(() => {
    const local = localStorage.getItem("preferences");
    if (local) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(local) })); } catch {}
    }
    if (userPreferences) {
      setForm(prev => ({ ...prev, ...userPreferences }));
    }
  }, [userPreferences]);

  const save = async () => {
    localStorage.setItem("preferences", JSON.stringify(form));
    // Try optional hook method if available
    try {
      const hook = useWorkoutProgram() as any;
      if (hook?.updatePreferences) await hook.updatePreferences(form);
      toast({ title: "Preferences saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message ?? "Unknown error" });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Equipment & Preferences</CardTitle>
        <CardDescription>Used to generate and scale your sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>Goal</Label>
            <Select value={form.goal} onValueChange={v => setForm(s => ({ ...s, goal: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
                <SelectItem value="fat_loss">Fat Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Days / Week</Label>
            <Input inputMode="numeric" value={form.daysPerWeek} onChange={e => setForm(s => ({ ...s, daysPerWeek: Number(e.target.value || 0) }))} />
          </div>
          <div>
            <Label>Typical Session Length (min)</Label>
            <div className="px-2">
              <Slider min={15} max={120} step={5} value={[form.typicalSessionMin]} onValueChange={([v]) => setForm(s => ({ ...s, typicalSessionMin: v }))} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{form.typicalSessionMin} minutes</div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Equipment Available</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(form.equipment).map(([k, v]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <Checkbox checked={v} onCheckedChange={c => setForm(s => ({ ...s, equipment: { ...s.equipment, [k]: Boolean(c) } }))} />
                <span className="capitalize">{k}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="injuries">Injuries / Restrictions</Label>
          <Input id="injuries" value={form.injuries} onChange={e => setForm(s => ({ ...s, injuries: e.target.value }))} placeholder="e.g., avoid heavy low-bar squats" />
        </div>

        <div className="flex gap-3">
          <Button onClick={save} className="bg-gradient-primary">Save</Button>
          <Button variant="outline" onClick={() => setForm({ daysPerWeek: 3, goal: "hypertrophy", typicalSessionMin: 60, equipment: { bodyweight: true, dumbbells: true, barbell: false, machines: false, bands: false }, injuries: "" })}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}


          {/* Notifications Tab */}
          import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function NotificationForm() {
  const [form, setForm] = useState({
    emailReminders: true,
    pushReminders: false,
    reminderTime: "08:00",
  });

  useEffect(() => {
    const local = localStorage.getItem("notifications");
    if (local) {
      try { setForm(prev => ({ ...prev, ...JSON.parse(local) })); } catch {}
    }
  }, []);

  const save = () => {
    localStorage.setItem("notifications", JSON.stringify(form));
    toast({ title: "Notifications saved" });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Reminders to keep you on track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="emailReminders">Email reminders</Label>
          <Switch id="emailReminders" checked={form.emailReminders} onCheckedChange={c => setForm(s => ({ ...s, emailReminders: Boolean(c) }))} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="pushReminders">Push notifications</Label>
          <Switch id="pushReminders" checked={form.pushReminders} onCheckedChange={c => setForm(s => ({ ...s, pushReminders: Boolean(c) }))} />
        </div>
        <div>
          <Label htmlFor="reminderTime">Daily reminder time</Label>
          <Input id="reminderTime" type="time" value={form.reminderTime} onChange={e => setForm(s => ({ ...s, reminderTime: e.target.value }))} />
        </div>
        <div className="flex gap-3">
          <Button onClick={save} className="bg-gradient-primary">Save</Button>
          <Button variant="outline" onClick={() => setForm({ emailReminders: true, pushReminders: false, reminderTime: "08:00" })}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}


          {/* Account Tab */}
         import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function AccountForm() {
  const { user, signOut, deleteAccount } = useAuth() as any; // optional methods in some setups

  const handleSignOut = async () => {
    try {
      if (signOut) await signOut();
      toast({ title: "Signed out" });
    } catch (e: any) {
      toast({ title: "Sign out failed", description: e?.message ?? "Unknown error" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete account permanently? This cannot be undone.")) return;
    try {
      if (deleteAccount) {
        await deleteAccount();
        toast({ title: "Account deleted" });
      } else {
        toast({ title: "Not available", description: "Delete endpoint not wired" });
      }
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message ?? "Unknown error" });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage access and identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="font-medium">Email</div>
          <div className="text-muted-foreground">{user?.email ?? "Not signed in"}</div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete account</Button>
        </div>
      </CardContent>
    </Card>
  );
}


        {/* Workout Program Generator Modal */}
        {showProgramGenerator && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-elevated max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Generate Workout Program</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowProgramGenerator(false)}
                  >
                    ×
                  </Button>
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

  return (
    <AuthGuard>
      {settingsContent}
    </AuthGuard>
  );
};

export default Settings;