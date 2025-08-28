import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";
import { AuthGuard } from "@/components/AuthGuard";
import { useUserMetrics } from "@/hooks/useUserMetrics";
import { ChevronLeft, Trophy, TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProgressPage = () => {
  const { metrics, isLoading } = useUserMetrics();

  const progressContent = (
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
                <h1 className="text-2xl font-bold">Progress</h1>
                <p className="text-sm text-muted-foreground">Track your fitness journey</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics ? 'On Track' : 'No Data'}
            </Badge>
          </div>
        </div>
      </header>

        <main className="container mx-auto p-4 pb-20 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading your progress...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="body">Body Metrics</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Weekly Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Week's Summary</CardTitle>
                    <CardDescription>Your training progress this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {metrics ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Workouts Completed</span>
                            <span>{metrics.weeklyProgress.completedWorkouts}/{metrics.weeklyProgress.targetWorkouts}</span>
                          </div>
                          <Progress 
                            value={(metrics.weeklyProgress.completedWorkouts / metrics.weeklyProgress.targetWorkouts) * 100} 
                            className="h-2" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-fitness-primary">{metrics.weeklyProgress.totalSets}</div>
                            <div className="text-sm text-muted-foreground">Total Sets</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-fitness-primary">{metrics.workoutStreak}</div>
                            <div className="text-sm text-muted-foreground">Day Streak</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">No workout data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Recent Personal Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {metrics && metrics.recentPRs.length > 0 ? (
                      <div className="space-y-3">
                        {metrics.recentPRs.map((pr, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <div className="font-medium">{pr.exercise}</div>
                              <div className="text-sm text-muted-foreground">
                                {pr.date.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{pr.weight} lbs</div>
                              <Badge variant="secondary" className="text-xs">
                                {pr.reps} reps
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No personal records yet. Keep training to set your first PR!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="body" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Body Composition</CardTitle>
                    <CardDescription>Track your physical progress over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics && metrics.bodyMetrics.length > 0 ? (
                      <div className="space-y-4">
                        {metrics.bodyMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium capitalize">{metric.type.replace('_', ' ')}</div>
                              <div className="text-2xl font-bold">{metric.value} {metric.unit}</div>
                            </div>
                            <div className="text-right">
                              <div className={`flex items-center gap-1 text-sm ${
                                metric.trend === 'up' ? 'text-green-600' : 
                                metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                              }`}>
                                {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                                 metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
                                {metric.change > 0 ? '+' : ''}{metric.change} {metric.unit}
                              </div>
                              <div className="text-xs text-muted-foreground">vs previous</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No body metrics recorded yet. Start tracking your measurements to see progress!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Exercise Records</CardTitle>
                    <CardDescription>Your best performances by exercise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics && metrics.recentPRs.length > 0 ? (
                      <div className="space-y-3">
                        {metrics.recentPRs.map((pr, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                              <div>
                                <div className="font-medium">{pr.exercise}</div>
                                <div className="text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {pr.date.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{pr.weight} lbs</div>
                              <div className="text-sm text-muted-foreground">{pr.reps} reps</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No records yet. Complete workouts to start building your record history!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>

      <BottomNav />
    </div>
  );

  return (
    <AuthGuard>
      {progressContent}
    </AuthGuard>
  );
};

export default ProgressPage;