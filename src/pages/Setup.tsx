import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Settings, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const Setup = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-card">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Complete Setup</h1>
            <p className="text-white/90">Connect your backend to unlock all features</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20 space-y-6">
        {/* Supabase Integration */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="h-6 w-6 text-fitness-primary" />
              Database Connection
            </CardTitle>
            <CardDescription>
              Connect to Supabase to enable user authentication, workout logging, and progress tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-fitness-primary/10 border border-fitness-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-fitness-primary mb-2">What you'll get:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-fitness-success" />
                  Auto-generated personalized workouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-fitness-success" />
                  Workout logging and progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-fitness-success" />
                  Progressive overload management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-fitness-success" />
                  Body metrics and photo tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-fitness-success" />
                  Fatigue-aware programming
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">How to connect:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click the green <strong>Supabase</strong> button in the top right</li>
                <li>Follow the setup wizard to create or connect your database</li>
                <li>Your fitness data will be securely stored and synced</li>
              </ol>
            </div>

            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" 
              size="lg"
              disabled
            >
              <Database className="mr-2 h-5 w-5" />
              Click Supabase Button Above to Connect
            </Button>
          </CardContent>
        </Card>

        {/* Current Features */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Available Now (Demo Mode)</CardTitle>
            <CardDescription>
              You can explore these features without a database connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Sample workout generation</span>
                <CheckCircle className="h-4 w-4 text-fitness-success" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Training interface preview</span>
                <CheckCircle className="h-4 w-4 text-fitness-success" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">App navigation and UI</span>
                <CheckCircle className="h-4 w-4 text-fitness-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return to Dashboard */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Setup;