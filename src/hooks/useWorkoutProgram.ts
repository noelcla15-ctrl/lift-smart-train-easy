import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
// Adjust this import if your client lives elsewhere, e.g. "@/supabaseClient"
import { supabase } from "@/integrations/supabase/client";

export type Preferences = {
  goal: "strength" | "hypertrophy" | "endurance" | "fat_loss";
  daysPerWeek: number;
  typicalSessionMin: number;
  equipment: Record<string, boolean>;
  injuries: string;
};

export type ActiveProgram = {
  id: string;
  name: string;
  sessions_per_week: number;
  duration_weeks: number;
  training_focus: string | null;
  is_active: boolean;
};

export function useWorkoutProgram() {
  const { user } = useAuth() as any;

  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [userPreferences, setUserPreferences] = useState<Preferences | null>(null);
  const [programLoading, setProgramLoading] = useState<boolean>(true);
  const [prefsLoading, setPrefsLoading] = useState<boolean>(true);

  const fetchActiveProgram = useCallback(async () => {
    if (!user?.id) { setActiveProgram(null); setProgramLoading(false); return; }
    setProgramLoading(true);
    const { data, error } = await supabase
      .from("workout_programs")
      .select("id, name, sessions_per_week, duration_weeks, training_focus, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1);
    if (error) {
      console.error("fetchActiveProgram error", error);
      setActiveProgram(null);
    } else {
      setActiveProgram((data as any[])?.[0] ?? null);
    }
    setProgramLoading(false);
  }, [user?.id]);

  const fetchPreferences = useCallback(async () => {
    if (!user?.id) { setUserPreferences(null); setPrefsLoading(false); return; }
    setPrefsLoading(true);
    const { data, error } = await supabase
      .from("user_preferences")
      .select("user_id, goal, days_per_week, typical_session_min, equipment, injuries")
      .eq("user_id", user.id)
      .limit(1);
    if (error) {
      console.error("fetchPreferences error", error);
      setUserPreferences(null);
    } else {
      const row = (data as any[])?.[0];
      if (row) {
        setUserPreferences({
          goal: row.goal,
          daysPerWeek: row.days_per_week,
          typicalSessionMin: row.typical_session_min,
          equipment: row.equipment ?? {},
          injuries: row.injuries ?? "",
        });
      } else {
        setUserPreferences(null);
      }
    }
    setPrefsLoading(false);
  }, [user?.id]);

  const updatePreferences = useCallback(async (prefs: Preferences) => {
    if (!user?.id) throw new Error("Not signed in");
    const payload = {
      user_id: user.id,
      goal: prefs.goal,
      days_per_week: prefs.daysPerWeek,
      typical_session_min: prefs.typicalSessionMin,
      equipment: prefs.equipment,
      injuries: prefs.injuries,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("user_preferences")
      .upsert(payload, { onConflict: "user_id" })
      .select("user_id, goal, days_per_week, typical_session_min, equipment, injuries")
      .limit(1);
    if (error) throw error;
    const row = (data as any[])?.[0];
    setUserPreferences({
      goal: row.goal,
      daysPerWeek: row.days_per_week,
      typicalSessionMin: row.typical_session_min,
      equipment: row.equipment ?? {},
      injuries: row.injuries ?? "",
    });
    return row;
  }, [user?.id]);

  useEffect(() => {
    fetchActiveProgram();
    fetchPreferences();
  }, [fetchActiveProgram, fetchPreferences]);

  return {
    activeProgram,
    userPreferences,
    loading: programLoading || prefsLoading,
    fetchActiveProgram,
    updatePreferences,
  };
}
