import { motion } from "motion/react";
import { Sun1, Moon } from "iconsax-react";
import { ZevaMark } from "@/components/ZevaMark";
import { setThemePref, type ThemePref } from "@/lib/theme";
import { haptic } from "@/lib/haptics";
import { APP_NAME } from "@/lib/brand";

/**
 * First-run mode picker (demo aid). Shown once before the splash so a pitch can
 * open straight into either look. Renders on the default dark ground; picking a
 * mode sets the preference and hands off to the splash. Temporary — remove by
 * dropping the "themepick" branch in App.tsx.
 */
export function ThemeChoice({ onPick }: { onPick: () => void }) {
  const choose = (pref: ThemePref) => { haptic("success"); setThemePref(pref); onPick(); };

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-bg px-7">
      {/* soft brand aura behind */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(80% 55% at 50% 22%, color-mix(in oklab, var(--color-teal) 16%, transparent), transparent 70%)" }} />

      <motion.div
        className="relative z-10 flex w-full max-w-[340px] flex-col items-center"
        initial="hidden" animate="show" transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
      >
        <motion.div variants={item} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex items-center gap-2">
          <ZevaMark size={30} tone="teal" live />
          <span className="font-display text-[24px] font-semibold lowercase tracking-tight text-ink">{APP_NAME}</span>
        </motion.div>

        <motion.h1 variants={item} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="mt-7 text-center font-display text-[22px] font-semibold leading-tight tracking-tight text-ink">
          Choose your look
        </motion.h1>
        <motion.p variants={item} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="mt-1.5 text-center text-[13px] text-dim">
          You can switch anytime in settings.
        </motion.p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3.5">
          {/* LIGHT */}
          <motion.button
            variants={item} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileTap={{ scale: 0.97 }} onClick={() => choose("light")}
            className="group flex flex-col items-center gap-3 rounded-[18px] border border-border bg-surface p-4"
          >
            <span className="flex h-[104px] w-full flex-col justify-between overflow-hidden rounded-[13px] p-2.5" style={{ background: "#f5f7fa", boxShadow: "inset 0 0 0 1px rgba(18,26,44,0.08)" }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#23c9b9" }} />
              <span className="flex flex-col gap-1">
                <span className="h-1.5 w-3/4 rounded-full" style={{ background: "#0e0f11" }} />
                <span className="h-1.5 w-1/2 rounded-full" style={{ background: "#c3c8d0" }} />
                <span className="mt-1 h-4 w-full rounded-[6px]" style={{ background: "#17181d" }} />
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
              <Sun1 size={16} variant="Bulk" color="var(--color-teal-2)" /> Light
            </span>
          </motion.button>

          {/* DARK */}
          <motion.button
            variants={item} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileTap={{ scale: 0.97 }} onClick={() => choose("dark")}
            className="group flex flex-col items-center gap-3 rounded-[18px] border border-border bg-surface p-4"
          >
            <span className="flex h-[104px] w-full flex-col justify-between overflow-hidden rounded-[13px] p-2.5" style={{ background: "#101216", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#23ffed" }} />
              <span className="flex flex-col gap-1">
                <span className="h-1.5 w-3/4 rounded-full" style={{ background: "#f4f6f8" }} />
                <span className="h-1.5 w-1/2 rounded-full" style={{ background: "#3a3f47" }} />
                <span className="mt-1 h-4 w-full rounded-[6px]" style={{ background: "var(--grad-teal, #23ffed)" }} />
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
              <Moon size={16} variant="Bulk" color="var(--color-teal-2)" /> Dark
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
