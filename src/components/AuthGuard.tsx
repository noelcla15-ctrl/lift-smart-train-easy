import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dumbbell, Lock, Users } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-primary rounded-2xl p-3">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Authentication Required</CardTitle>
                <CardDescription>
                  Please sign in to access this feature and track your fitness progress
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <span className="text-sm">Track your workouts and progress</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Secure personal data storage</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Button asChild className="w-full">
                  <Link to="/auth">Sign In / Sign Up</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};