import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Target, Waves, Clock, Dumbbell, Check } from "lucide-react";
import { GeneratedWorkout } from "@/types/workout";
import { WorkoutExercise } from "@/types/workout";
import { formatReps, formatWeight, formatTime } from "@/utils/formatters";

interface WorkoutSummaryProps {
  workout: GeneratedWorkout | {
    name: string;
    exercises: WorkoutExercise[];
  };
  currentExerciseIndex?: number;
  showCompleted?: boolean;
  isCompact?: boolean;
}

interface ExerciseDisplayItem {
  id?: string;
  name: string;
  sets: number;
  reps: number | string;
  weight?: number;
  restTime: number;
  notes?: string;
}

interface ExerciseSection {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  exercises: ExerciseDisplayItem[];
}

export const WorkoutSummary = ({ 
  workout, 
  currentExerciseIndex = 0, 
  showCompleted = false,
  isCompact = false 
}: WorkoutSummaryProps) => {
  // Determine if this is a generated workout or active workout
  const isGeneratedWorkout = 'warmup' in workout || 'cooldown' in workout;
  
  const sections: ExerciseSection[] = [];
  let exerciseOffset = 0;

  // Add warmup section
  if (isGeneratedWorkout && (workout as GeneratedWorkout).warmup?.length) {
    sections.push({
      title: "Warm-up",
      icon: Flame,
      color: "text-fitness-warning",
      bgColor: "bg-fitness-warning/10 border-fitness-warning/20",
      exercises: (workout as GeneratedWorkout).warmup!
    });
    exerciseOffset += (workout as GeneratedWorkout).warmup!.length;
  }

  // Add main exercises section
  const mainExercises: ExerciseDisplayItem[] = workout.exercises.map(ex => ({
    id: ex.id || crypto.randomUUID(),
    name: ex.name,
    sets: 'sets' in ex ? ex.sets : (ex.sets as any)?.length || 0,
    reps: 'reps' in ex ? ex.reps : (ex.sets as any)?.[0]?.reps || 0,
    weight: ex.weight,
    restTime: ex.restTime,
    notes: ex.notes
  }));

  sections.push({
    title: "Main Workout",
    icon: Target,
    color: "text-fitness-primary",
    bgColor: "bg-fitness-primary/10 border-fitness-primary/20",
    exercises: mainExercises
  });

  // Add cooldown section
  if (isGeneratedWorkout && (workout as GeneratedWorkout).cooldown?.length) {
    sections.push({
      title: "Cool-down",
      icon: Waves,
      color: "text-fitness-accent",
      bgColor: "bg-fitness-accent/10 border-fitness-accent/20",
      exercises: (workout as GeneratedWorkout).cooldown!
    });
  }


  const isExerciseCompleted = (globalIndex: number) => {
    if (!showCompleted) return false;
    return globalIndex < currentExerciseIndex;
  };

  const isCurrentExercise = (globalIndex: number) => {
    return showCompleted && globalIndex === currentExerciseIndex;
  };

  let globalExerciseIndex = 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workout.name}</CardTitle>
          {isGeneratedWorkout && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {(workout as GeneratedWorkout).estimatedDuration} min
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const sectionStartIndex = globalExerciseIndex;
          
          return (
            <div key={section.title}>
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${section.bgColor}`}>
                  <section.icon className={`h-4 w-4 ${section.color}`} />
                </div>
                <h3 className="font-medium text-sm">{section.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {section.exercises.length} exercise{section.exercises.length > 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Exercises in Section */}
              <div className="space-y-2">
                {section.exercises.map((exercise, exerciseIndex) => {
                  const currentGlobalIndex = globalExerciseIndex++;
                  const isCompleted = isExerciseCompleted(currentGlobalIndex);
                  const isCurrent = isCurrentExercise(currentGlobalIndex);

                  return (
                    <div
                      key={exercise.id || `${section.title}-${exerciseIndex}`}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${isCurrent 
                          ? 'border-fitness-primary bg-fitness-primary/5 ring-1 ring-fitness-primary/20' 
                          : isCompleted 
                            ? 'border-fitness-success/30 bg-fitness-success/5'
                            : 'border-border bg-muted/30'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${isCurrent 
                              ? 'bg-fitness-primary text-white' 
                              : isCompleted 
                                ? 'bg-fitness-success text-white'
                                : 'bg-muted-foreground/20 text-muted-foreground'
                            }
                          `}>
                            {isCompleted ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              currentGlobalIndex + 1
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {exercise.name}
                            </div>
                            {!isCompact && (
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Dumbbell className="h-3 w-3" />
                                  {exercise.sets} × {formatReps(exercise.reps)}
                                </div>
                                <div>{formatWeight(exercise.weight)}</div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(exercise.restTime)}
                                </div>
                              </div>
                            )}
                            {!isCompact && exercise.notes && (
                              <div className="text-xs text-muted-foreground mt-1 italic">
                                {exercise.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        {isCompact && (
                          <div className="text-xs text-muted-foreground">
                            {exercise.sets} × {formatReps(exercise.reps)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {sectionIndex < sections.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          );
        })}

        {/* Workout Stats */}
        {!isCompact && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Exercises</span>
              <span>{workout.exercises.length + (isGeneratedWorkout ? 
                ((workout as GeneratedWorkout).warmup?.length || 0) + 
                ((workout as GeneratedWorkout).cooldown?.length || 0) : 0
              )}</span>
            </div>
            {isGeneratedWorkout && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Time</span>
                <span>{(workout as GeneratedWorkout).estimatedDuration} minutes</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};