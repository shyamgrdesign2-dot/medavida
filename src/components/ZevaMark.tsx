import { motion } from "motion/react";

// Real Zeva geometry (from the brand SVGs): two arrow strokes that interlock
// into a Z. Top arrow = inflow, bottom arrow = outflow.
const TOP = "M28.0327 0L0 0L12.0931 9.90433L0 29.6089L28.0327 0Z";
const BOTTOM = "M2.85399 30.8438L30.8867 30.8437L18.7936 20.9394L30.8867 1.23489L2.85399 30.8438Z";

/** Static mark — teal metallic fill. Use in headers, cards, chips. */
export function ZevaMark({ size = 40, tone = "teal" }: { size?: number; tone?: "teal" | "ink" | "mono" }) {
  const id = "zg" + tone;
  const fill =
    tone === "ink" ? "var(--color-ink)" : tone === "mono" ? "#ffffff" : `url(#${id})`;
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" aria-label="Zeva">
      {tone === "teal" && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5cffef" />
            <stop offset="0.55" stopColor="#23ffed" />
            <stop offset="1" stopColor="#0fd8c8" />
          </linearGradient>
        </defs>
      )}
      <path d={TOP} fill={fill} />
      <path d={BOTTOM} fill={fill} />
    </svg>
  );
}

/**
 * Splash sequence: the two arrows fly in — TOP from the left, BOTTOM from the
 * right — ninja-slash into place with motion-streak trails, and lock into the Z.
 * The parent (Splash) renders the impact spark; this owns the arrows only.
 */
function ArrowSVG({ d, size }: { d: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" style={{ overflow: "visible", display: "block", filter: "drop-shadow(0 0 8px rgba(35,255,237,0.6))" }}>
      <defs>
        <linearGradient id="zgSlash" x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8ffff4" />
          <stop offset="0.5" stopColor="#23ffed" />
          <stop offset="1" stopColor="#0fd8c8" />
        </linearGradient>
      </defs>
      <path d={d} fill="url(#zgSlash)" />
    </svg>
  );
}

/**
 * Two arrows thrown in from OUTSIDE the screen on steep diagonals — the top
 * arrow from the upper-left, the bottom arrow from the lower-right — spinning
 * and motion-blurred like flung blades, converging on center at the same beat.
 * `onLock` fires the instant they meet so the parent can spark on contact.
 */
export function ZevaMarkSlash({ size = 128, onLock }: { size?: number; onLock?: () => void }) {
  const FLY = 0.34;
  const ease = [0.6, 0, 0.15, 1] as const; // fast launch, hard stop
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* TOP arrow — thrown in from the upper-LEFT, from off-screen */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: -320, y: -300, opacity: 0, rotate: -48, filter: "blur(3px)" }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ duration: FLY, delay: 0.25, ease }}
      >
        <ArrowSVG d={TOP} size={size} />
      </motion.div>
      {/* BOTTOM arrow — thrown in from the lower-RIGHT; lands on the same beat → contact */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: 320, y: 300, opacity: 0, rotate: 48, filter: "blur(3px)" }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ duration: FLY, delay: 0.29, ease }}
        onAnimationComplete={onLock}
      >
        <ArrowSVG d={BOTTOM} size={size} />
      </motion.div>
    </div>
  );
}
