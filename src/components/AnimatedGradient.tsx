import { useReducedMotion } from "motion/react";

/** Premium animated aurora gradient wash for section cards (ReactBits-style). */
export function AnimatedGradient({ tone = "teal", opacity = 1 }: { tone?: "teal" | "cool" | "warm"; opacity?: number }) {
  const reduce = useReducedMotion();
  const g =
    tone === "teal"
      ? "linear-gradient(115deg, var(--aurora-1) 0%, transparent 28%, var(--aurora-2) 52%, transparent 74%, var(--aurora-1) 100%)"
      : tone === "warm"
      ? "linear-gradient(115deg, rgba(247,185,85,0.24) 0%, transparent 30%, rgba(255,120,80,0.16) 55%, transparent 78%, rgba(247,185,85,0.2) 100%)"
      : "linear-gradient(115deg, rgba(60,120,255,0.24) 0%, transparent 30%, rgba(120,150,200,0.14) 55%, transparent 78%, rgba(60,120,255,0.18) 100%)";
  return (
    <div
      className={reduce ? "pointer-events-none absolute inset-0" : "anim-aurora pointer-events-none absolute inset-0"}
      style={{ backgroundImage: g, backgroundSize: "300% 300%", opacity }}
    />
  );
}
