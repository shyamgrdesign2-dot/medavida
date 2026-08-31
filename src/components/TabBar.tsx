import { motion } from "motion/react";
import { Home2, Cards as CardsIcon, ArrowSwapHorizontal, Chart21, Category, type Icon as IconsaxIcon } from "iconsax-react";
import { haptic } from "@/lib/haptics";
import { useAnySheetOpen } from "@/lib/sheetStore";

export type Tab = "home" | "cards" | "activity" | "insights" | "more";

// iconsax duotone set — Bulk (filled) when active, Linear (outline) when not.
const TABS: { id: Tab; label: string; icon: IconsaxIcon }[] = [
  { id: "home", label: "Home", icon: Home2 },
  { id: "cards", label: "Cards", icon: CardsIcon },
  { id: "activity", label: "Activity", icon: ArrowSwapHorizontal },
  { id: "insights", label: "Insights", icon: Chart21 },
  { id: "more", label: "More", icon: Category },
];

const spring = { type: "spring", stiffness: 420, damping: 38 } as const;

/**
 * Floating liquid-glass navbar. A single teal pill morphs (layoutId) to the
 * active tab and reveals its label; inactive tabs are icon-only. Floats over
 * the content with heavy backdrop blur — the modern Apple/Google pattern.
 */
export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const hidden = useAnySheetOpen();
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-5"
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 40 }}
    >
      <div className="liquid-nav pointer-events-auto flex items-center gap-0.5 rounded-full p-1.5">
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { haptic("select"); onChange(t.id); }}
              className="relative flex items-center gap-1.5 rounded-full px-3 py-2.5"
              aria-label={t.label}
            >
              {on && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full" style={{ background: "var(--grad-teal)" }} transition={spring} />}
              <span className="relative z-10">
                <t.icon size={21} variant={on ? "Bulk" : "Linear"} color={on ? "var(--color-on-teal)" : "var(--color-faint)"} />
              </span>
              {on && (
                <motion.span
                  className="relative z-10 overflow-hidden whitespace-nowrap text-[12.5px] font-bold text-on-teal"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  transition={spring}
                >
                  {t.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
