import { LightRays } from "./backgrounds/LightRays";

/**
 * Clean, lightweight app background — soft teal glows + subtle ReactBits
 * LightRays from the top (behind the card on Home). One WebGL canvas; the rays
 * fade out in light mode via --rays-op so they never muddy the light theme.
 */
export function AppBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-bg">
      <div className="absolute inset-x-0 top-0 h-[62%]" style={{ opacity: "var(--rays-op)" }}>
        <LightRays raysOrigin="top-center" raysColor="#23FFED" raysSpeed={0.55} lightSpread={1.1} rayLength={1.5} followMouse={false} />
      </div>
      <div
        className="absolute inset-x-0 top-0 h-[55%]"
        style={{ background: "radial-gradient(90% 60% at 50% -6%, var(--bg-glow), transparent 62%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{ background: "radial-gradient(90% 70% at 50% 110%, var(--bg-glow-2), transparent 60%)" }}
      />
    </div>
  );
}
