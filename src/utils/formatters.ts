// Shared formatting utilities to eliminate redundancy across components

export const formatReps = (reps: number | string): string => {
  return typeof reps === 'string' ? reps : reps.toString();
};

export const formatWeight = (weight?: number): string => {
  if (!weight || weight === 0) return 'Bodyweight';
  return `${weight} lbs`;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const parseReps = (reps: number | string): number => {
  return typeof reps === 'string' ? parseInt(reps) || 1 : reps;
};