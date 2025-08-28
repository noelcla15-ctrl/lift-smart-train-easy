import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutSet } from "@/hooks/useWorkoutSession";

interface SetLoggingModalProps {
  setData: WorkoutSet;
  setIndex: number;
  onLogSet: (setIndex: number, data: Partial<WorkoutSet>) => void;
  children: React.ReactNode;
}

export const SetLoggingModal = ({ setData, setIndex, onLogSet, children }: SetLoggingModalProps) => {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState(setData.weight?.toString() || "0");
  const [reps, setReps] = useState(setData.reps?.toString() || "1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 1;
    
    onLogSet(setIndex, {
      weight: weightNum,
      reps: repsNum,
      completed: true
    });
    
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setWeight(setData.weight?.toString() || "0");
    setReps(setData.reps?.toString() || "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Set {setIndex + 1}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Enter reps"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Log Set
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};