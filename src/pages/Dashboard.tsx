import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Play, Target, TrendingUp, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

const Dashboard = () => {
  const { user } = useAuth();

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
                Week 3, Day 2
              </Badge>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 space-y-6">
        {/* Today's Workout Card */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-fitness-primary" />
                  Today's Workout
                </CardTitle>
                <CardDescription>Upper Body - Hypertrophy Focus</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Estimated</div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  45 min
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Readiness Score</span>
                <span className="font-medium text-fitness-accent">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-fitness-primary">6</div>
                <div className="text-sm text-muted-foreground">Exercises</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-fitness-accent">18</div>
                <div className="text-sm text-muted-foreground">Total Sets</div>
              </div>
            </div>

            <Link to="/train">
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start Workout
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Week Progress */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-fitness-accent" />
              This Week's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Workouts Completed</span>
                  <span className="font-medium">2/4</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Volume</span>
                  <span className="font-medium">12/20 sets</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-primary">7</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-accent">12</div>
                <div className="text-sm text-muted-foreground">PRs This Month</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Reminder - Show if not authenticated or missing data */}
        {!user && (
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
    </div>
  );

  return (
    <AuthGuard fallback={dashboardContent}>
      {dashboardContent}
    </AuthGuard>
  );
};

export default Dashboard;