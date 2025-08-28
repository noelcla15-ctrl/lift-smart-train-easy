import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Timer, Check, Plus, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { AuthGuard } from "@/components/AuthGuard";
import { useState } from "react";

const Training = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);

  const workout = {
    name: "Upper Body - Hypertrophy",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { weight: 135, reps: 8, rpe: null, completed: false },
          { weight: 155, reps: 6, rpe: null, completed: false },
          { weight: 165, reps: 5, rpe: null, completed: false },
        ],
        restTime: 180,
        notes: "Focus on controlled tempo"
      },
      {
        name: "Pull-ups",
        sets: [
          { weight: 0, reps: 8, rpe: null, completed: false },
          { weight: 0, reps: 7, rpe: null, completed: false },
          { weight: 0, reps: 6, rpe: null, completed: false },
        ],
        restTime: 120,
        notes: "Full range of motion"
      },
      {
        name: "Dumbbell Shoulder Press",
        sets: [
          { weight: 45, reps: 10, rpe: null, completed: false },
          { weight: 45, reps: 9, rpe: null, completed: false },
          { weight: 40, reps: 10, rpe: null, completed: false },
        ],
        restTime: 90,
        notes: ""
      }
    ]
  };

  const currentEx = workout.exercises[currentExercise];

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
                <h1 className="font-semibold">{workout.name}</h1>
                <p className="text-sm text-muted-foreground">Exercise {currentExercise + 1} of {workout.exercises.length}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
              {isResting ? `Rest: ${restTime}s` : 'Working'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 space-y-6">
        {/* Current Exercise */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">{currentEx.name}</CardTitle>
            {currentEx.notes && (
              <CardDescription>{currentEx.notes}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sets */}
            <div className="space-y-3">
              {currentEx.sets.map((set, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight'} × {set.reps} reps
                      </div>
                      {set.rpe && (
                        <div className="text-xs text-muted-foreground">
                          Target RPE: {set.rpe}
                        </div>
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
                      <Button size="sm" variant="outline">
                        Log Set
                      </Button>
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
            <div className="flex gap-3">
              {currentExercise > 0 && (
                <Button variant="outline" onClick={() => setCurrentExercise(currentExercise - 1)}>
                  Previous Exercise
                </Button>
              )}
              {currentExercise < workout.exercises.length - 1 ? (
                <Button 
                  className="flex-1 bg-gradient-primary" 
                  onClick={() => setCurrentExercise(currentExercise + 1)}
                >
                  Next Exercise
                </Button>
              ) : (
                <Button className="flex-1 bg-gradient-accent">
                  Finish Workout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workout Progress */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Workout Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentExercise + 1}/{workout.exercises.length} exercises
                </span>
              </div>
              <div className="flex gap-1">
                {workout.exercises.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${
                      index <= currentExercise ? 'bg-fitness-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );

  return (
    <AuthGuard>
      {trainingContent}
    </AuthGuard>
  );
};

export default Training;