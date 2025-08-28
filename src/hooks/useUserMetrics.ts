import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserMetrics {
  workoutStreak: number;
  monthlyPRs: number;
  weeklyProgress: {
    completedWorkouts: number;
    totalSets: number;
    targetWorkouts: number;
  };
  recentPRs: Array<{
    exercise: string;
    weight: number;
    reps: number;
    date: Date;
  }>;
  bodyMetrics: Array<{
    type: string;
    value: number;
    unit: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
    date: Date;
  }>;
  readinessScore: number;
}

export const useUserMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchUserMetrics();
  }, [user]);

  const fetchUserMetrics = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch workout logs for streak and weekly progress
      const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      // Fetch exercise logs for PRs
      const { data: exerciseLogs } = await supabase
        .from('exercise_logs')
        .select(`
          *,
          exercises:exercise_id (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch body metrics
      const { data: bodyMetrics } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      // Fetch performance metrics for readiness score
      const { data: performanceMetrics } = await supabase
        .from('user_performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('metric_date', { ascending: false })
        .limit(7);

      // Calculate metrics
      const workoutStreak = calculateWorkoutStreak(workoutLogs || []);
      const monthlyPRs = calculateMonthlyPRs(exerciseLogs || []);
      const weeklyProgress = calculateWeeklyProgress(workoutLogs || []);
      const recentPRs = calculateRecentPRs(exerciseLogs || []);
      const processedBodyMetrics = processBodyMetrics(bodyMetrics || []);
      const readinessScore = calculateReadinessScore(performanceMetrics || []);

      setMetrics({
        workoutStreak,
        monthlyPRs,
        weeklyProgress,
        recentPRs,
        bodyMetrics: processedBodyMetrics,
        readinessScore,
      });
    } catch (error) {
      console.error('Error fetching user metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWorkoutStreak = (logs: any[]) => {
    if (!logs.length) return 0;

    let streak = 0;
    const today = new Date();
    const sortedLogs = logs.sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );

    for (const log of sortedLogs) {
      const logDate = new Date(log.completed_at);
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateMonthlyPRs = (logs: any[]) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return logs.filter(log => 
      new Date(log.created_at) > oneMonthAgo && 
      log.weights_kg && log.weights_kg.length > 0
    ).length;
  };

  const calculateWeeklyProgress = (logs: any[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyLogs = logs.filter(log => 
      new Date(log.completed_at) > oneWeekAgo
    );

    return {
      completedWorkouts: weeklyLogs.length,
      totalSets: weeklyLogs.reduce((total, log) => total + (log.total_sets || 0), 0),
      targetWorkouts: 3, // Default target, could be from user preferences
    };
  };

  const calculateRecentPRs = (logs: any[]) => {
    const prs = logs
      .filter(log => log.weights_kg && log.weights_kg.length > 0)
      .slice(0, 3)
      .map(log => ({
        exercise: log.exercises?.name || 'Unknown Exercise',
        weight: Math.round((log.weights_kg[0] || 0) * 2.20462), // Convert kg to lbs
        reps: log.reps_completed?.[0] || 0,
        date: new Date(log.created_at),
      }));

    return prs;
  };

  const processBodyMetrics = (metrics: any[]) => {
    const grouped = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_type]) {
        acc[metric.metric_type] = [];
      }
      acc[metric.metric_type].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(grouped).map(([type, typeMetrics]) => {
      const latest = typeMetrics[0];
      const previous = typeMetrics[1];
      const change = previous ? latest.value - previous.value : 0;
      
      return {
        type: latest.metric_type,
        value: latest.value,
        unit: latest.unit,
        change,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
        date: new Date(latest.recorded_at),
      };
    });
  };

  const calculateReadinessScore = (metrics: any[]) => {
    if (!metrics.length) return 85; // Default good score

    const latest = metrics[0];
    const sleepScore = (latest.sleep_quality || 7) * 10;
    const stressScore = Math.max(0, 100 - (latest.stress_level || 3) * 20);
    const fatigueScore = Math.max(0, 100 - (latest.fatigue_level || 3) * 20);
    const motivationScore = (latest.motivation_level || 7) * 10;

    return Math.round((sleepScore + stressScore + fatigueScore + motivationScore) / 4);
  };

  return {
    metrics,
    isLoading,
    refetch: fetchUserMetrics,
  };
};