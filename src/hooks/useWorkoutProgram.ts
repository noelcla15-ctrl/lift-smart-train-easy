import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type WorkoutProgram = {
  id: string;
  user_id: string;
  name: string;
  program_type: "full_body" | "upper_lower" | "push_pull_legs";
  training_focus: "strength" | "hypertrophy" | "endurance" | "general_fitness";
  duration_weeks: number;
  sessions_per_week: number;
  is_active: boolean;
  created_at?: string;
};

export type Preferences = {
  goal: "strength" | "hypertrophy" | "endurance" | "fat_loss";
  daysPerWeek: number;
  typicalSessionMin: number;
  equipment: Record<string, boolean>; // { dumbbells: true, barbell: false, ... }
  injuries: string;
};

export function useWorkoutProgram() {
  const { user } = useAuth() as any;

  const [activeProgram, setActiveProgram] = useState<WorkoutProgram | null>(null);
  const [userPreferences, setUserPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActiveProgram = useCallback(async () => {
    if (!user?.id) { setActiveProgram(null); return; }
    const { data, error } = await supabase
      .from("workout_programs")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("fetchActiveProgram", error);
      setActiveProgram(null);
    } else {
      setActiveProgram(data as any);
    }
  }, [user?.id]);

  const fetchPreferences = useCallback(async () => {
    if (!user?.id) { setUserPreferences(null); return; }
    const { data, error } = await supabase
      .from("user_preferences")
      .select("goal, days_per_week, typical_session_min, equipment, injuries")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("fetchPreferences", error);
      setUserPreferences(null);
      return;
    }
    if (!data) { setUserPreferences(null); return; }

    setUserPreferences({
      goal: (data.goal || "hypertrophy") as Preferences["goal"],
      daysPerWeek: Number(data.days_per_week ?? 3),
      typicalSessionMin: Number(data.typical_session_min ?? 60),
      equipment: data.equipment ?? {},
      injuries: data.injuries ?? "",
    });
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
    const { error } = await supabase
      .from("user_preferences")
      .upsert(payload, { onConflict: "user_id" });
    if (error) throw error;
    await fetchPreferences();
  }, [user?.id, fetchPreferences]);

  // Create program and set it active. Deactivate existing ones.
  const createProgram = useCallback(async (p: {
    name: string;
    program_type: WorkoutProgram["program_type"];
    training_focus: WorkoutProgram["training_focus"];
    duration_weeks: number;
    sessions_per_week: number;
  }) => {
    if (!user?.id) throw new Error("Not signed in");

    // deactivate existing
    const { error: upErr } = await supabase
      .from("workout_programs")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);
    if (upErr) throw upErr;

    // insert new
    const insertPayload = {
      user_id: user.id,
      name: p.name,
      program_type: p.program_type,
      training_focus: p.training_focus,
      duration_weeks: p.duration_weeks,
      sessions_per_week: p.sessions_per_week,
      is_active: true,
    };
    const { data, error } = await supabase
      .from("workout_programs")
      .insert(insertPayload)
      .select("*")
      .single();
    if (error) throw error;

    setActiveProgram(data as any);
    return data as WorkoutProgram;
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([fetchActiveProgram(), fetchPreferences()]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [fetchActiveProgram, fetchPreferences]);

  return {
    activeProgram,
    userPreferences,
    loading,
    fetchActiveProgram,
    updatePreferences,
    createProgram,
  };
}
