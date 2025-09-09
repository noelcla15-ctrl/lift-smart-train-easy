import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";
import { WorkoutProgram, useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { toast } from "sonner";

interface ProgramModificationModalProps {
  program: WorkoutProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onProgramUpdated: () => void;
}

export const ProgramModificationModal = ({
  program,
  isOpen,
  onClose,
  onProgramUpdated,
}: ProgramModificationModalProps) => {
  // Guards to avoid rendering when closed or no program
  if (!isOpen) return null;
  if (!program) return null;

  // Safe locals to avoid calling string methods on undefined
  const p = program as any;
  const name = String(p?.name ?? "");
  const type = String(p?.program_type ?? "");
  const focus = String(p?.training_focus ?? "general_fitness");
  const durationWeeks = Number(p?.duration_weeks ?? 8);
  const sessionsPerWeek = Number(p?.sessions_per_week ?? 3);

  const { createProgram } = useWorkoutProgram();

  const [formData, setFormData] = useState({
    name,
    program_type: type,
    training_focus: focus,
    duration_weeks: durationWeeks,
    sessions_per_week: sessionsPerWeek,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (program) {
      const p2 = program as any;
      setFormData({
        name: String(p2?.name ?? ""),
        program_type: String(p2?.program_type ?? ""),
        training_focus: String(p2?.training_focus ?? "general_fitness"),
        duration_weeks: Number(p2?.duration_weeks ?? 8),
        sessions_per_week: Number(p2?.sessions_per_week ?? 3),
      });
    }
  }, [program]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await createProgram(formData);
      toast.success("Program updated successfully!");
      onProgramUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating program:", error);
      toast.error("Failed to update program");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Modify Workout Program</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Program Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Name:</span> {name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Type:</span>{" "}
                {String(type)
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
              <div className="text-sm">
                <span className="font-medium">Focus:</span>{" "}
                {String(focus)
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
              <div className="text-sm">
                <span className="font-medium">Duration:</span> {durationWeeks} weeks
              </div>
              <div className="text-sm">
                <span className="font-medium">Frequency:</span> {sessionsPerWeek} sessions per week
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Modification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modify Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Program Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter program name"
                />
              </div>

              {/* Program Type */}
              <div className="space-y-2">
                <Label htmlFor="program_type">Program Type</Label>
                <Select
                  value={formData.program_type}
                  onValueChange={(value) => handleInputChange("program_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_body">Full Body</SelectItem>
                    <SelectItem value="upper_lower">Upper/Lower Split</SelectItem>
                    <SelectItem value="push_pull_legs">Push/Pull/Legs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Training Focus */}
              <div className="space-y-2">
                <Label htmlFor="training_focus">Training Focus</Label>
                <Select
                  value={formData.training_focus}
                  onValueChange={(value) => handleInputChange("training_focus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select training focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="hypertrophy">Hypertrophy (Muscle Growth)</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Program Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => handleInputChange("duration_weeks", parseInt(e.target.value || "0", 10))}
                  min={4}
                  max={52}
                  step={1}
                />
              </div>

              {/* Sessions Per Week */}
              <div className="space-y-2">
                <Label htmlFor="sessions">Sessions Per Week</Label>
                <Select
                  value={String(formData.sessions_per_week)}
                  onValueChange={(value) => handleInputChange("sessions_per_week", parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sessions per week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 sessions</SelectItem>
                    <SelectItem value="3">3 sessions</SelectItem>
                    <SelectItem value="4">4 sessions</SelectItem>
                    <SelectItem value="5">5 sessions</SelectItem>
                    <SelectItem value="6">6 sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Note:</strong> Saving changes will create a new program with your modifications and set it as active. Your current program will be deactivated but not deleted.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
