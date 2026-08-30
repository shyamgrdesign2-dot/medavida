import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ZevaMarkSlash } from "@/components/ZevaMark";

/**
 * Loading screen. Two arrows are thrown in on diagonals, spark on contact, and
 * lock into the Z; a shimmer plays while it loads. Then the Z flies up to the
 * top-left header slot (shrinking) and hands off to the next screen's mark —
 * a connected splash→onboarding→sign-in transition. No text.
 */
export function Splash({ onDone, hold = false }: { onDone: () => void; hold?: boolean }) {
  const [locked, setLocked] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lock = setTimeout(() => setLocked(true), 1050); // fallback if onLock misfires
    if (hold) return () => clearTimeout(lock);
    // fly the mark to the top-left header position, then hand off
    const leave = setTimeout(() => {
      const el = rootRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setTarget({ x: 34 - r.width / 2, y: 46 - r.height / 2 }); // ≈ header mark centre
      }
      setLeaving(true);
    }, 1850);
    const done = setTimeout(onDone, 2450);
    return () => { clearTimeout(lock); clearTimeout(leave); clearTimeout(done); };
  }, [onDone, hold]);

  return (
    <div ref={rootRef} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" animate={{ opacity: leaving ? 0.25 : 1 }} transition={{ duration: 0.5 }}>
        <AnimatedBackground variant="waves" intensity={locked ? 1 : 0.7} />
      </motion.div>

      <div className="relative flex h-[150px] w-[150px] items-center justify-center">
        <AnimatePresence>
          {locked && (
            <>
              <motion.div
                key="flash"
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(35,255,237,0.5) 35%, transparent 65%)" }}
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                key="cut"
                className="absolute left-1/2 top-1/2 h-[2px] -translate-x-1/2 -translate-y-1/2"
                style={{ width: 260, background: "linear-gradient(90deg, transparent, #7dfff2, #ffffff, #7dfff2, transparent)", rotate: "-24deg" }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.2, 0, 0, 1] }}
              />
              {Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-[2px] w-3 rounded-full bg-teal"
                    style={{ rotate: `${(a * 180) / Math.PI}deg` }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 90, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                );
              })}
              <motion.div
                key="aura"
                className="absolute h-[220px] w-[220px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(35,255,237,0.28), transparent 62%)" }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0.7], scale: [0.6, 1.1, 1] }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-10"
          animate={
            leaving
              ? { x: target?.x ?? 0, y: target?.y ?? 0, scale: 0.19 }
              : locked
              ? { x: [0, -3, 3, -2, 0], y: [0, 2, -2, 1, 0] }
              : {}
          }
          transition={leaving ? { type: "spring", stiffness: 220, damping: 28 } : { duration: 0.28 }}
        >
          <ZevaMarkSlash size={112} onLock={() => setLocked(true)} />
        </motion.div>
      </div>

      {/* shimmer loader */}
      <motion.div
        className="relative mt-14 h-[3px] w-[92px] overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : locked ? 1 : 0 }}
        transition={{ duration: leaving ? 0.25 : 0.4, delay: leaving ? 0 : 0.2 }}
      >
        <motion.div
          className="absolute inset-y-0 w-1/2 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #23ffed, transparent)" }}
          animate={{ x: ["-120%", "240%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
