import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/BottomNav";
import { AuthGuard } from "@/components/AuthGuard";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserMetrics } from "@/hooks/useUserMetrics";
import { useWorkoutGeneration } from "@/hooks/useWorkoutGeneration";
import { useWorkoutProgram } from "@/hooks/useWorkoutProgram";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { WorkoutDetailModal } from "@/components/WorkoutDetailModal";
import { Dumbbell, Calendar, Target, Timer, Flame, Trophy, Loader2, Play, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const { user } = useAuth();
  const { metrics, isLoading: metricsLoading } = useUserMetrics();
  const { todaysWorkout, isLoading: workoutLoading } = useWorkoutGeneration();
  const { activeProgram } = useWorkoutProgram();
  const { activeWorkout, isLoading: sessionLoading } = useWorkoutSession();

  // Derived values for an active in-progress session
  const sessionStats = useMemo(() => {
    if (!activeWorkout) return null;
    const totalSets = activeWorkout.exercises?.reduce((sum: number, ex: any) => sum + (ex.sets?.length || 0), 0) || 0;
    const doneSets = activeWorkout.exercises?.reduce(
      (sum: number, ex: any) => sum + (ex.sets?.filter((s: any) => s.completed)?.length || 0),
      0
    ) || 0;
    const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
    return { totalSets, doneSets, pct };
  }, [activeWorkout]);

  const dashboardContent = (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-hero shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">FitSmart</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {activeProgram ? `${activeProgram.name}` : "No Program"}
              </Badge>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 space-y-6">
        {user ? (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/train">
                <Button className="w-full bg-gradient-primary" size="lg">
                  <Play className="h-4 w-4 mr-2" /> Train
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full" size="lg">
                  <RotateCcw className="h-4 w-4 mr-2" /> Program
                </Button>
              </Link>
            </div>

            {/* Resume Session if active */}
            {activeWorkout && (
              <Card className="shadow-card border-fitness-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Resume Session</CardTitle>
                      <CardDescription>{activeWorkout.name || "In-progress workout"}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
                      {sessionStats?.pct || 0}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={sessionStats?.pct || 0} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{sessionStats?.doneSets || 0} sets done</span>
                    <span>{sessionStats?.totalSets || 0} total</span>
                  </div>
                  <Link to="/train">
                    <Button className="w-full bg-gradient-primary" size="lg">
                      <Play className="h-4 w-4 mr-2" /> Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Today's Workout */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Today's Workout</CardTitle>
                    <CardDescription>
                      {workoutLoading ? (
                        <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
                      ) : todaysWorkout ? (
                        todaysWorkout.name
                      ) : activeProgram ? (
                        `${activeProgram.name} - Rest Day`
                      ) : (
                        "No active program"
                      )}
                    </CardDescription>
                  </div>
                  {metrics && (
                    <Badge variant="outline" className="bg-fitness-success/10 text-fitness-success border-fitness-success/20">
                      <Target className="h-3 w-3 mr-1" /> Ready: {metrics.readinessScore}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysWorkout ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-fitness-primary">{todaysWorkout.exercises.length}</div>
                        <div className="text-sm text-muted-foreground">Exercises</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-fitness-primary">
                          {todaysWorkout.exercises.reduce((t: number, ex: any) => t + (ex.sets || 0), 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Sets</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-fitness-secondary/10 text-fitness-secondary">Ready</Badge>
                      <Button variant="ghost" size="sm" onClick={() => setShowWorkoutDetail(true)} className="text-xs">
                        View Details
                      </Button>
                    </div>
                    <Link to="/train">
                      <Button className="w-full bg-gradient-primary text-white">Start Workout</Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      {activeProgram ? "Rest day - let your muscles recover" : "Set up your workout program to get started"}
                    </p>
                    {!activeProgram && (
                      <Link to="/settings">
                        <Button className="bg-gradient-primary">Create Program</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* This Week's Progress */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">This Week's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metricsLoading ? (
                  <div className="flex items-center justify-center py-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                ) : metrics ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Workouts Completed</span>
                      <span className="text-sm font-medium">
                        {metrics.weeklyProgress.completedWorkouts}/{metrics.weeklyProgress.targetWorkouts}
                      </span>
                    </div>
                    <Progress
                      value={
                        metrics.weeklyProgress.targetWorkouts > 0
                          ? (metrics.weeklyProgress.completedWorkouts / metrics.weeklyProgress.targetWorkouts) * 100
                          : 0
                      }
                      className="h-2"
                    />
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Sets</span>
                      <span className="text-sm font-medium">{metrics.weeklyProgress.totalSets}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">{metricsLoading ? "--" : metrics?.workoutStreak || 0}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold">{metricsLoading ? "--" : metrics?.monthlyPRs || 0}</div>
                      <div className="text-xs text-muted-foreground">PRs This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="shadow-card border-fitness-warning/20 bg-fitness-warning/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <Calendar className="h-8 w-8 text-fitness-warning mx-auto" />
                <div>
                  <div className="font-semibold text-fitness-warning">Sign In Required</div>
                  <div className="text-sm text-muted-foreground">Sign in to save your workouts and track progress</div>
                </div>
                <Link to="/auth">
                  <Button variant="outline" className="border-fitness-warning text-fitness-warning hover:bg-fitness-warning hover:text-white">
                    Sign In / Sign Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />

      {/* Workout Detail Modal */}
      <WorkoutDetailModal workout={todaysWorkout} isOpen={showWorkoutDetail} onClose={() => setShowWorkoutDetail(false)} />
    </div>
  );

  return (
    <AuthGuard fallback={dashboardContent}>{dashboardContent}</AuthGuard>
  );
};

export default Dashboard;
