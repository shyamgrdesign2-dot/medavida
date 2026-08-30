import { useEffect, useRef, useState } from "react";
import {
  motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion,
} from "motion/react";
import { Wifi, Eye, EyeOff } from "lucide-react";
import type { ZCard } from "@/lib/data";
import { money } from "@/lib/data";
import { ZevaMark } from "./ZevaMark";
import { APP_NAME } from "@/lib/brand";
import { haptic } from "@/lib/haptics";

const RADIUS = 10;

type PatternKind = "waves" | "hatch" | "rings";
const VARIANT: Record<
  ZCard["variant"],
  { base: string; ink: string; line: string; markTone: "teal" | "mono"; pattern: PatternKind; sheen: string; ring: string }
> = {
  teal: {
    base: "linear-gradient(145deg, #1c2725 0%, #0f1817 38%, #060d0c 68%, #0b1614 100%)",
    ink: "#eafffb", line: "rgba(35,255,237,0.10)", markTone: "teal", pattern: "waves",
    sheen: "rgba(120,255,240,0.16)", ring: "rgba(35,255,237,0.18)",
  },
  graphite: {
    base: "linear-gradient(145deg, #30353c 0%, #1b1f25 42%, #0d1013 72%, #191d22 100%)",
    ink: "#eef1f3", line: "rgba(255,255,255,0.07)", markTone: "mono", pattern: "hatch",
    sheen: "rgba(255,255,255,0.18)", ring: "rgba(255,255,255,0.12)",
  },
  credit: {
    base: "linear-gradient(145deg, #103029 0%, #08160f 44%, #04120d 72%, #073f36 122%)",
    ink: "#eafffb", line: "rgba(35,255,237,0.12)", markTone: "teal", pattern: "rings",
    sheen: "rgba(120,255,240,0.2)", ring: "rgba(35,255,237,0.24)",
  },
};

/* ---- per-variant patterns ---- */
function tilePath(y: number, amp: number) {
  let d = `M 0 ${y}`;
  for (let x = 0; x < 320; x += 64) d += ` q 16 ${-amp} 32 0 q 16 ${amp} 32 0`;
  return d;
}
const WAVE_LINES = Array.from({ length: 9 }, (_, i) => tilePath(14 + i * 22, i % 2 ? 7 : 4.5));

function Pattern({ kind, color, drift }: { kind: PatternKind; color: string; drift: boolean }) {
  if (kind === "hatch") {
    return (
      <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(114deg, ${color} 0 1px, transparent 1px 8px)` }} />
    );
  }
  if (kind === "rings") {
    return (
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx="300" cy="188" r={26 + i * 28} fill="none" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    );
  }
  // waves (drifting)
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: RADIUS }}>
      <div className="flex h-full w-[200%]" style={{ animation: drift ? "cardDrift 22s linear infinite" : "none" }}>
        {[0, 1].map((k) => (
          <svg key={k} viewBox="0 0 320 200" preserveAspectRatio="none" className="h-full w-1/2 flex-none" aria-hidden>
            {WAVE_LINES.map((d, i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          </svg>
        ))}
      </div>
    </div>
  );
}

function EmvChip() {
  return (
    <div className="relative h-[26px] w-[34px] overflow-hidden rounded-[5px]" style={{ background: "linear-gradient(135deg, #f6e3a8 0%, #d9b45f 42%, #b5892f 100%)", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.5)" }}>
      <svg viewBox="0 0 34 26" className="absolute inset-0 h-full w-full" fill="none" stroke="#8a6a24" strokeWidth="1">
        <line x1="0" y1="9" x2="34" y2="9" /><line x1="0" y1="17" x2="34" y2="17" />
        <line x1="11" y1="0" x2="11" y2="9" /><line x1="23" y1="0" x2="23" y2="9" />
        <line x1="11" y1="17" x2="11" y2="26" /><line x1="23" y1="17" x2="23" y2="26" />
        <rect x="11" y="9" width="12" height="8" rx="1.5" stroke="#8a6a24" />
      </svg>
    </div>
  );
}

// iOS needs an explicit permission grant (on a user gesture) for gyroscope.
type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function ZevaCard({ card, interactive = true }: { card: ZCard; interactive?: boolean }) {
  const v = VARIANT[card.variant];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [gyroReady, setGyroReady] = useState(false);
  const [hidden, setHidden] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 24 });
  const sy = useSpring(py, { stiffness: 150, damping: 24 });
  const rotX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const hx = useTransform(sx, [-0.5, 0.5], [12, 88]);
  const hy = useTransform(sy, [-0.5, 0.5], [8, 92]);
  const shine = useMotionTemplate`radial-gradient(50% 80% at ${hx}% ${hy}%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 42%, transparent 72%)`;
  // metallic sheen band shifts with tilt (only moves when you move the card)
  const bandX = useTransform(sx, [-0.5, 0.5], ["-24%", "24%"]);

  function onMove(e: React.PointerEvent) {
    if (!interactive || reduce) return;
    const r = ref.current!.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  const reset = () => { px.set(0); py.set(0); };

  function onOrient(e: DeviceOrientationEvent) {
    const g = (e.gamma ?? 0) / 40;
    const b = ((e.beta ?? 0) - 45) / 40;
    px.set(Math.max(-0.5, Math.min(0.5, g)));
    py.set(Math.max(-0.5, Math.min(0.5, b)));
  }
  async function enableGyro() {
    if (gyroReady || reduce) return;
    const D = window.DeviceOrientationEvent as DOE | undefined;
    if (D && typeof D.requestPermission === "function") {
      try { if ((await D.requestPermission()) !== "granted") return; } catch { return; }
    }
    window.addEventListener("deviceorientation", onOrient);
    setGyroReady(true);
  }

  // auto-attach where no permission is required (Android/desktop sensors)
  useEffect(() => {
    if (!interactive || reduce) return;
    const D = window.DeviceOrientationEvent as DOE | undefined;
    if (D && typeof D.requestPermission === "function") return; // iOS → wait for tap
    window.addEventListener("deviceorientation", onOrient);
    setGyroReady(true);
    return () => window.removeEventListener("deviceorientation", onOrient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, reduce]);
  useEffect(() => () => window.removeEventListener("deviceorientation", onOrient), []); // cleanup gyro from tap-enable

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={enableGyro}
      className="relative w-full select-none overflow-hidden"
      style={{
        aspectRatio: "1.586 / 1", borderRadius: RADIUS, transformPerspective: 900,
        rotateX: interactive ? rotX : 0, rotateY: interactive ? rotY : 0, transformStyle: "preserve-3d",
        background: v.base, isolation: "isolate",
        boxShadow: `inset 0 0 0 1px ${v.ring}, inset 0 1px 1px rgba(255,255,255,0.16), inset 0 -2px 4px rgba(0,0,0,0.5), 0 12px 26px -14px rgba(0,0,0,0.72)`,
      }}
    >
      <Pattern kind={v.pattern} color={v.line} drift={!reduce} />

      {/* top-left light source (metallic) */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(80% 60% at 20% 0%, rgba(255,255,255,0.12), transparent 55%)" }} />
      {/* metallic sheen band, tilt-driven */}
      <motion.div className="pointer-events-none absolute -inset-y-2 w-1/3" style={{ left: "34%", x: interactive ? bandX : 0, background: `linear-gradient(100deg, transparent, ${v.sheen} 50%, transparent)`, filter: "blur(2px)" }} />
      {/* pointer/gyro specular (no mix-blend — avoids mobile layer-blanking) */}
      <motion.div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: interactive ? shine : "none" }} />

      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ color: v.ink, transform: "translateZ(30px)" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ZevaMark size={22} tone={v.markTone} />
            <div>
              <div className="emboss font-display text-[15px] font-semibold lowercase leading-none tracking-tight">{APP_NAME}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-medium uppercase tracking-[0.16em] opacity-55">{card.label}</span>
                <span className="rounded-[3px] px-1 py-[1px] font-mono text-[7.5px] font-bold uppercase tracking-[0.12em]" style={{ background: "rgba(255,255,255,0.14)" }}>{card.type}</span>
              </div>
            </div>
          </div>
          <Wifi size={18} strokeWidth={2} className="rotate-90 opacity-60" />
        </div>

        {/* balance — the card's own balance, maskable */}
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[8px] font-medium uppercase tracking-[0.16em] opacity-50">{card.balanceLabel}</div>
            <div className="tnum mt-0.5 font-display text-[25px] font-semibold leading-none">
              {hidden ? "$ • • • • •" : money(card.balance)}
            </div>
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); haptic("tap"); setHidden((h) => !h); }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            aria-label={hidden ? "Show balance" : "Hide balance"}
          >
            {hidden ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <EmvChip />
            <div className="emboss font-mono tnum text-[12px] font-bold tracking-[0.1em] opacity-90">•••• {card.last4}</div>
          </div>
          <div className="font-mono tnum text-[10px] font-medium opacity-60">{card.exp} · {card.type}</div>
        </div>
      </div>
    </motion.div>
  );
}
