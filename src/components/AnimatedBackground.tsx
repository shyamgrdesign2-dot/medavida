import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GradientWaves } from "./backgrounds/GradientWaves";
import { useThemePref } from "@/lib/theme";

/**
 * Cosmic background. `variant="waves"` uses the ReactBits GradientWaves WebGL
 * shader (themed teal); `variant="css"` uses lightweight drifting blobs.
 * Both keep the star field + vignette + grain overlay for depth.
 */
export function AnimatedBackground({
  intensity = 1,
  variant = "css",
}: {
  intensity?: number;
  variant?: "css" | "waves";
}) {
  const reduce = useReducedMotion();
  const isLight = useThemePref() === "light"; // system defaults to dark in this app

  const stars = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        id: i,
        top: Math.round(hash(i * 2.3) * 100),
        left: Math.round(hash(i * 7.1 + 3) * 100),
        size: hash(i * 3.7) > 0.85 ? 2 : 1,
        delay: hash(i * 1.9) * 4,
        dur: 2.4 + hash(i * 5.3) * 3,
      })),
    []
  );

  const blob = (style: React.CSSProperties, anim: any, dur: number) => (
    <motion.div
      className="absolute rounded-full"
      style={{ filter: "blur(56px)", ...style }}
      animate={reduce ? undefined : anim}
      transition={{ duration: dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-bg">
      {variant === "waves" ? (
        <div className="absolute inset-0" style={{ opacity: `calc(${0.9 * intensity} * var(--waves-op, 1))` }}>
          {/* light mode tints the whole shader teal against white; dark keeps its defaults */}
          <GradientWaves
            opacity={0.95}
            brightness={isLight ? 1.05 : 0.95}
            tilt={1.2}
            speed={0.3}
            mouseInteraction
            {...(isLight ? { horizonColor: "#f2fbf9", waveColor: "#2fd0c0", crestColor: "#8ff5ea" } : {})}
          />
        </div>
      ) : (
        <>
          {blob(
            { width: 300, height: 300, top: "-8%", left: "-15%", background: "radial-gradient(circle, rgba(35,255,237,0.34), transparent 70%)", opacity: 0.9 * intensity },
            { x: [0, 40, -10, 0], y: [0, 30, 10, 0], scale: [1, 1.15, 1] },
            16
          )}
          {blob(
            { width: 320, height: 320, bottom: "-10%", right: "-18%", background: "radial-gradient(circle, rgba(15,216,200,0.30), transparent 70%)", opacity: 0.85 * intensity },
            { x: [0, -30, 10, 0], y: [0, -20, 12, 0], scale: [1, 1.2, 1] },
            19
          )}
          {blob(
            { width: 240, height: 240, top: "34%", left: "42%", background: "radial-gradient(circle, rgba(60,120,255,0.16), transparent 70%)", opacity: 0.7 * intensity },
            { x: [0, 24, -18, 0], y: [0, -26, 14, 0], scale: [1, 1.1, 1] },
            22
          )}
        </>
      )}

      {/* star field — css variant only (waves carries its own texture) */}
      {variant === "css" &&
        stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute rounded-full"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, background: "var(--star)" }}
            animate={reduce ? { opacity: 0.4 } : { opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

      {/* vignette + grain for depth */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 25%, transparent 45%, var(--bg-vignette) 100%)" }} />
      <div className="grain absolute inset-0" />
    </div>
  );
}

// deterministic pseudo-random so SSR/first paint is stable and Date.now-free
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
