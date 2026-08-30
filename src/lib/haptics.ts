// Lightweight haptics. navigator.vibrate works on Android/Chrome; on iOS it's
// a no-op (Safari doesn't expose the API), so this degrades gracefully.
type Kind = "tap" | "select" | "success" | "impact";
const P: Record<Kind, number | number[]> = {
  tap: 8,
  select: 12,
  success: [10, 40, 20],
  impact: 22,
};
export function haptic(kind: Kind = "tap") {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(P[kind]);
  } catch {
    /* ignore */
  }
}
