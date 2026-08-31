import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from "motion/react";
import { subscribeGyro } from "@/lib/gyro";

// Real Zeva geometry (from the brand SVGs): two arrow strokes that interlock
// into a Z. Top arrow = inflow, bottom arrow = outflow.
const TOP = "M28.0327 0L0 0L12.0931 9.90433L0 29.6089L28.0327 0Z";
const BOTTOM = "M2.85399 30.8438L30.8867 30.8437L18.7936 20.9394L30.8867 1.23489L2.85399 30.8438Z";

type Tone = "teal" | "card" | "ink" | "mono";

function MarkSvg({ size, tone }: { size: number; tone: Tone }) {
  const id = "zg" + tone;
  const grad = tone === "teal" || tone === "card";
  const fill = tone === "ink" ? "var(--color-ink)" : tone === "mono" ? "#ffffff" : `url(#${id})`;
  // card = always bright; teal = theme tokens so it survives a white background
  const stops = tone === "card" ? ["#5cffef", "#23ffed", "#0fd8c8"] : ["var(--mark-1)", "var(--mark-2)", "var(--mark-3)"];
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" aria-label="Zeva" className="block">
      {grad && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor={stops[0]} />
            <stop offset="0.55" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        </defs>
      )}
      <path d={TOP} fill={fill} />
      <path d={BOTTOM} fill={fill} />
    </svg>
  );
}

/**
 * Static mark. `teal` uses a theme-aware gradient (bright in dark, darker in
 * light so it stays visible on white). `card` is always the bright metallic
 * teal — for the always-dark card face. `ink`/`mono` are solid.
 *
 * `live` makes the mark a small metallic object that tilts with the shared gyro
 * stream (same source as the cards) plus a specular sweep — a living logo. Falls
 * back to fully static when there's no device motion / reduced-motion is set.
 */
export function ZevaMark({ size = 40, tone = "teal", live = false }: { size?: number; tone?: Tone; live?: boolean }) {
  if (live) return <LiveMark size={size} tone={tone} />;
  return <MarkSvg size={size} tone={tone} />;
}

function LiveMark({ size, tone }: { size: number; tone: Tone }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const gx = useTransform(sx, [-0.5, 0.5], [15, 85]);
  const gy = useTransform(sy, [-0.5, 0.5], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(60% 60% at ${gx}% ${gy}%, rgba(255,255,255,0.7), rgba(255,255,255,0) 60%)`;

  useEffect(() => {
    if (reduce) return;
    return subscribeGyro((g) => { px.set(g.x); py.set(g.y); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size, transformPerspective: 300, rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY, transformStyle: "preserve-3d" }}
    >
      <MarkSvg size={size} tone={tone} />
      {/* specular sweep — clipped to the mark so it reads as brushed metal */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: sheen, WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 31 31'%3E%3Cpath d='${TOP}'/%3E%3Cpath d='${BOTTOM}'/%3E%3C/svg%3E")`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 31 31'%3E%3Cpath d='${TOP}'/%3E%3Cpath d='${BOTTOM}'/%3E%3C/svg%3E")`, maskSize: "contain", maskRepeat: "no-repeat" }}
        />
      )}
    </motion.div>
  );
}

/**
 * Splash sequence: the two arrows fly in — TOP from the left, BOTTOM from the
 * right — ninja-slash into place with motion-streak trails, and lock into the Z.
 * The parent (Splash) renders the impact spark; this owns the arrows only.
 */
function ArrowSVG({ d, size }: { d: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 31 31" fill="none" style={{ overflow: "visible", display: "block", filter: "drop-shadow(0 0 8px var(--mark-glow, rgba(35,255,237,0.6)))" }}>
      <defs>
        <linearGradient id="zgSlash" x1="0" y1="0" x2="31" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--mark-1)" />
          <stop offset="0.5" stopColor="var(--mark-2)" />
          <stop offset="1" stopColor="var(--mark-3)" />
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
