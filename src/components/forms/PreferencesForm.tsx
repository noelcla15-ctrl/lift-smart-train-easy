import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { toast } from "sonner";

export function PreferencesForm() {
  const { userPreferences, updatePreferences } = useWorkoutProgram() as any;

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
    } as Record<string, boolean>,
    injuries: "",
  });

  useEffect(() => {
    const local = localStorage.getItem("preferences");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setForm((s) => ({ ...s, ...parsed }));
      } catch {}
    }
    if (userPreferences) {
      setForm((s) => ({
        ...s,
        daysPerWeek: Number(userPreferences.daysPerWeek ?? s.daysPerWeek),
        goal: String(userPreferences.goal ?? s.goal),
        typicalSessionMin: Number(userPreferences.typicalSessionMin ?? s.typicalSessionMin),
        equipment: { ...s.equipment, ...(userPreferences.equipment || {}) },
        injuries: String(userPreferences.injuries ?? s.injuries),
      }));
    }
  }, [userPreferences]);

  const save = async () => {
    localStorage.setItem("preferences", JSON.stringify(form));
    try {
      await updatePreferences?.(form);
      toast.success("Preferences saved");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Save failed");
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
            <Select
              value={form.goal}
              onValueChange={(v) => setForm((s) => ({ ...s, goal: v }))}
            >
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
            <Input
              inputMode="numeric"
              value={form.daysPerWeek}
              onChange={(e) => setForm((s) => ({ ...s, daysPerWeek: Number(e.target.value || 0) }))}
            />
          </div>
          <div>
            <Label>Typical Session Length (min)</Label>
            <div className="px-2">
              <Slider
                min={15}
                max={120}
                step={5}
                value={[form.typicalSessionMin]}
                onValueChange={([v]) => setForm((s) => ({ ...s, typicalSessionMin: v }))}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{form.typicalSessionMin} minutes</div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Equipment Available</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(form.equipment).map(([k, v]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={v}
                  onCheckedChange={(c) =>
                    setForm((s) => ({ ...s, equipment: { ...s.equipment, [k]: Boolean(c) } }))
                  }
                />
                <span className="capitalize">{k}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="injuries">Injuries / Restrictions</Label>
          <Input
            id="injuries"
            value={form.injuries}
            onChange={(e) => setForm((s) => ({ ...s, injuries: e.target.value }))}
            placeholder="e.g., avoid heavy low-bar squats"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={save} className="bg-gradient-primary">Save</Button>
          <Button
            variant="outline"
            onClick={() =>
              setForm({
                daysPerWeek: 3,
                goal: "hypertrophy",
                typicalSessionMin: 60,
                equipment: { bodyweight: true, dumbbells: true, barbell: false, machines: false, bands: false },
                injuries: "",
              })
            }
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
