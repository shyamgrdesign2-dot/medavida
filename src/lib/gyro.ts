// Shared device-orientation store. On the first user gesture anywhere in the app
// we request motion permission (required on iOS); once granted, every subscriber
// — all cards AND the logo mark — tilts in sync from the one sensor stream.
// On desktop / devices without orientation events this stays inert, so callers
// fall back to pointer hover (cards) or a static mark with zero regression.

type G = { x: number; y: number };

let started = false;
let last: G = { x: 0, y: 0 };
const subs = new Set<(g: G) => void>();

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

function handle(e: DeviceOrientationEvent) {
  // gamma = left/right tilt, beta = front/back; normalise to -0.5..0.5 like the card
  const x = Math.max(-0.5, Math.min(0.5, (e.gamma ?? 0) / 40));
  const y = Math.max(-0.5, Math.min(0.5, ((e.beta ?? 0) - 45) / 40));
  last = { x, y };
  subs.forEach((f) => f(last));
}

/**
 * Ask for motion access and begin streaming. MUST be called from a user gesture
 * on iOS (the requestPermission popup only appears then). Safe to call repeatedly
 * — it no-ops once started.
 */
export async function startGyro(): Promise<void> {
  if (started || typeof window === "undefined") return;
  const D = window.DeviceOrientationEvent as DOE | undefined;
  if (!D) return;
  if (typeof D.requestPermission === "function") {
    try {
      if ((await D.requestPermission()) !== "granted") return;
    } catch {
      return; // denied or not in a gesture — leave callers on their fallback
    }
  }
  window.addEventListener("deviceorientation", handle);
  started = true;
}

/** Subscribe to the shared tilt. Immediately fires with the last value. */
export function subscribeGyro(fn: (g: G) => void): () => void {
  subs.add(fn);
  fn(last);
  return () => { subs.delete(fn); };
}

export function gyroStarted(): boolean {
  return started;
}
