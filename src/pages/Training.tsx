import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Timer, Check, Plus, RotateCcw, Loader2, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AuthGuard } from "@/components/AuthGuard";
import { WorkoutSummary } from "@/components/WorkoutSummary";
import { SetLoggingModal } from "@/components/SetLoggingModal";
import { useState, useEffect, useRef, useMemo } from "react";
import { useWorkoutGeneration } from "@/hooks/useWorkoutGeneration";
import { useWorkoutSession, WorkoutSet } from "@/hooks/useWorkoutSession";
import { toast } from "@/hooks/use-toast";

const Training = () => {
  const { todaysWorkout, isLoading: loadingWorkout } = useWorkoutGeneration();
  const { activeWorkout, isLoading: sessionLoading, startWorkout, logSet, completeWorkout } = useWorkoutSession();

  const [currentExercise, setCurrentExercise] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);
  const restTimerRef = useRef<number | null>(null);
  

  // Resolve the workout source once
  const workout = useMemo(() => {
    if (activeWorkout) return activeWorkout;
    if (!todaysWorkout) return null;
    return {
      name: todaysWorkout.name,
      exercises: todaysWorkout.exercises.map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        sets: Array(ex.sets)
          .fill(null)
          .map(() => ({
            weight: ex.weight || 0,
            reps: typeof ex.reps === "string" ? parseInt(ex.reps) || 1 : ex.reps,
            rpe: null,
            completed: false,
          })),
        restTime: ex.restTime ?? 90,
        notes: ex.notes || "",
        exerciseId: ex.exerciseId,
      })),
    } as typeof activeWorkout;
  }, [activeWorkout, todaysWorkout]);

  // Progress over main exercises only
  const totalExercises = workout?.exercises.length ?? 0;
  const boundedIndex = totalExercises ? Math.min(currentExercise, totalExercises - 1) : 0;
  const currentEx = totalExercises ? workout!.exercises[boundedIndex] : undefined;
  const progressPercentage = totalExercises > 0 ? (currentExercise / totalExercises) * 100 : 0;

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTime > 0) {
      restTimerRef.current = window.setTimeout(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            toast({ title: "Rest complete", description: "Next set." });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restTimerRef.current !== null) {
        window.clearTimeout(restTimerRef.current);
        restTimerRef.current = null;
      }
    };
  }, [isResting, restTime]);

  // Reset exercise index when workout changes
  useEffect(() => {
    setCurrentExercise(0);
  }, [workout?.name]);

  const handleStartWorkout = async () => {
    if (!todaysWorkout || !workout) return;
    await startWorkout({ name: workout.name, exercises: workout.exercises });
  };

  const handleLogSet = async (setIndex: number, setData: Partial<WorkoutSet>) => {
    if (!currentEx || !activeWorkout) return;
    await logSet(boundedIndex, setIndex, setData);
    // Start rest timer
    setRestTime(currentEx.restTime);
    setIsResting(true);
  };

  const handleFinishWorkout = async () => {
    await completeWorkout();
  };

  if (loadingWorkout) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your workout...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!workout && !todaysWorkout) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No workout available today.</p>
            <Link to="/settings">
              <Button>Set Up Your Program</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const trainingContent = (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">{workout?.name || "Today's Workout"}</h1>
                <p className="text-sm text-muted-foreground">
                  Exercise {Math.min(currentExercise + 1, Math.max(totalExercises, 1))} of {Math.max(totalExercises, 1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeWorkout && (
                <div className="text-xs text-muted-foreground">{Math.round(progressPercentage)}% complete</div>
              )}
              <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
                {isResting ? `Rest: ${restTime}s` : activeWorkout ? "Working" : "Ready to Start"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 space-y-6">
        {/* Pre-Workout Summary */}
        {!activeWorkout && todaysWorkout && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">{todaysWorkout.name}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {todaysWorkout.exercises.length} exercises
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {todaysWorkout.estimatedDuration} min
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleStartWorkout} disabled={sessionLoading} className="w-full bg-gradient-primary" size="lg">
                {sessionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting Workout...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Start Workout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}


        {/* Current Exercise */}
        {currentEx && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">{currentEx.name}</CardTitle>
              {currentEx.notes && <CardDescription>{currentEx.notes}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sets */}
              <div className="space-y-3">
                {currentEx.sets.map((set: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {set.weight > 0 ? `${set.weight} lbs` : "Bodyweight"} × {set.reps} reps
                        </div>
                        {set.rpe !== null && set.rpe !== undefined && (
                          <div className="text-xs text-muted-foreground">Target RPE: {set.rpe}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {set.completed ? (
                        <Badge variant="default" className="bg-fitness-success">
                          <Check className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      ) : (
                        <SetLoggingModal setData={set} setIndex={index} onLogSet={handleLogSet}>
                          <Button size="sm" variant="outline" disabled={!activeWorkout}>
                            Log Set
                          </Button>
                        </SetLoggingModal>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest Timer */}
              {isResting && (
                <Card className="bg-fitness-primary/5 border-fitness-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <Timer className="h-8 w-8 text-fitness-primary mx-auto" />
                      <div>
                        <div className="text-3xl font-bold text-fitness-primary">{restTime}s</div>
                        <div className="text-sm text-muted-foreground">Rest Time Remaining</div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="outline" onClick={() => setRestTime(restTime + 30)}>
                          <Plus className="h-4 w-4" />
                          30s
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsResting(false)}>
                          Skip Rest
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRestTime(currentEx.restTime)}>
                          <RotateCcw className="h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Exercise Navigation */}
              {activeWorkout && (
                <div className="flex gap-3">
                  {currentExercise > 0 && (
                    <Button variant="outline" onClick={() => setCurrentExercise((p) => Math.max(p - 1, 0))}>
                      Previous Exercise
                    </Button>
                  )}
                  {currentExercise < totalExercises - 1 ? (
                    <Button className="flex-1 bg-gradient-primary" onClick={() => setCurrentExercise((p) => Math.min(p + 1, totalExercises - 1))} size="lg">
                      Next Exercise
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-gradient-accent" onClick={handleFinishWorkout} disabled={sessionLoading} size="lg">
                      {sessionLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Finishing...
                        </>
                      ) : (
                        "Finish Workout"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Workout Progress */}
        {activeWorkout && (
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.min(currentExercise + 1, totalExercises)}/{totalExercises} exercises
                  </span>
                </div>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Started</span>
                    <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
                    <span>Finish</span>
                  </div>
                </div>

                {/* Section-specific progress simplified to main workout */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium capitalize">Current: Main Workout</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.min(currentExercise + 1, totalExercises)}/{totalExercises}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: totalExercises }, (_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= currentExercise ? "bg-fitness-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );

  return <AuthGuard>{trainingContent}</AuthGuard>;
};

export default Training;
