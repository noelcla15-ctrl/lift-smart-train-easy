import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, Calendar, Camera, Weight, Ruler } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const ProgressPage = () => {
  // Mock data for demonstration
  const weeklyProgress = {
    chest: 85,
    back: 92,
    shoulders: 78,
    legs: 88,
    arms: 76
  };

  const recentPRs = [
    { exercise: "Bench Press", weight: "225 lbs", date: "2 days ago" },
    { exercise: "Squat", weight: "315 lbs", date: "1 week ago" },
    { exercise: "Deadlift", weight: "365 lbs", date: "2 weeks ago" }
  ];

  const bodyMetrics = [
    { metric: "Weight", value: "185 lbs", change: "-2 lbs", trend: "down" },
    { metric: "Body Fat", value: "12%", change: "-1%", trend: "down" },
    { metric: "Chest", value: "42 in", change: "+0.5 in", trend: "up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-20">
      {/* Header */}
      <div className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Progress</h1>
              <p className="text-sm text-muted-foreground mt-1">Track your fitness journey</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                On Track
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Body Metrics</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Volume Progress */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-fitness-primary" />
                  Weekly Volume Progress
                </CardTitle>
                <CardDescription>
                  Target sets completed per muscle group this week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(weeklyProgress).map(([muscle, progress]) => (
                  <div key={muscle} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{muscle}</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Readiness Indicator */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-fitness-accent" />
                  Training Readiness
                </CardTitle>
                <CardDescription>
                  Based on recent RPE and recovery metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-fitness-accent">Good</div>
                    <div className="text-sm text-muted-foreground">Ready for intense training</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">Recovery Score</div>
                    <div className="text-2xl font-bold text-fitness-accent">8.2/10</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Body Metrics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-fitness-primary" />
                  Body Measurements
                </CardTitle>
                <CardDescription>
                  Track your physical progress over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bodyMetrics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{item.metric}</div>
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge 
                        variant={item.trend === 'up' ? 'default' : 'secondary'}
                        className={item.trend === 'up' ? 'bg-fitness-accent text-white' : 'bg-muted text-muted-foreground'}
                      >
                        {item.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Photo Progress */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-fitness-primary" />
                  Progress Photos
                </CardTitle>
                <CardDescription>
                  Visual tracking of your transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center space-y-3">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">No photos yet</p>
                      <p className="text-xs text-muted-foreground">Take your first progress photo</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Add Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            {/* Personal Records */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-fitness-primary" />
                  Recent Personal Records
                </CardTitle>
                <CardDescription>
                  Your latest strength achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPRs.map((pr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-fitness-primary/5 border border-fitness-primary/10 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{pr.exercise}</div>
                      <div className="text-sm text-muted-foreground">{pr.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-fitness-primary">{pr.weight}</div>
                      <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
                        PR
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Streak Counter */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-fitness-accent" />
                  Training Streak
                </CardTitle>
                <CardDescription>
                  Consistency is key to progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-fitness-accent">12</div>
                  <div className="text-sm text-muted-foreground">days in a row</div>
                  <Badge variant="outline" className="border-fitness-accent text-fitness-accent">
                    Keep it up!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProgressPage;