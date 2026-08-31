import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import {
  Profile, Box, Profile2User, Flash, Building, Card as CardIcon, MoneyChange,
  Activity, Health, Truck, Wifi, Wallet, Send2, DocumentText, Drop, InfoCircle,
  type Icon as IconsaxIcon,
} from "iconsax-react";

// transaction category → iconsax Bulk icon + accent (varied, not all-green)
const CAT: Record<string, { Icon: IconsaxIcon; tint: string }> = {
  patient: { Icon: Profile, tint: "var(--acc-teal)" },
  supplier: { Icon: Box, tint: "var(--acc-blue)" },
  payroll: { Icon: Profile2User, tint: "var(--acc-green)" },
  utility: { Icon: Flash, tint: "var(--acc-amber)" },
  rent: { Icon: Building, tint: "var(--acc-violet)" },
  loan: { Icon: MoneyChange, tint: "var(--acc-mint)" },
  fee: { Icon: CardIcon, tint: "var(--acc-slate)" },
};

// string → iconsax icon map (TXNS/data reference icons by name)
export const ICONS: Record<string, IconsaxIcon> = {
  HeartPulse: Activity, Pill: Health, Zap: Flash, Users: Profile2User, Truck, Building2: Building,
  Wallet, Send: Send2, FileText: DocumentText, CreditCard: CardIcon, Wifi, Droplet: Drop,
};
export const Icon = ({ name, size = 16, ...p }: { name: string; size?: number } & Record<string, unknown>) => {
  const C = ICONS[name] ?? DocumentText;
  return <C size={size} variant="Bulk" color="currentColor" {...p} />;
};

/** Profile avatar — refined monogram badge (muted graphite-teal, subtle sheen). */
export function PatternAvatar({ size = 40, label }: { seed?: string; size?: number; label?: string }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size, height: size,
        background: "linear-gradient(150deg, #26403c 0%, #17231f 55%, #0f1a17 100%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(35,255,237,0.22)",
      }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(70% 55% at 30% 22%, rgba(35,255,237,0.16), transparent 60%)" }} />
      {label && <span className="relative z-10 font-display font-bold tracking-tight" style={{ fontSize: size * 0.34, color: "var(--color-teal-soft)" }}>{label}</span>}
    </div>
  );
}

/* stoplight status chip — MedaVida brand system */
export function Chip({ tone = "neutral", children }: { tone?: "neutral" | "pos" | "warn" | "neg" | "accent"; children: ReactNode }) {
  const map = {
    neutral: "bg-surface-3 text-dim",
    pos: "bg-go/15 text-go",
    warn: "bg-caution/15 text-caution",
    neg: "bg-stop/15 text-stop",
    accent: "bg-teal text-on-teal",
  } as const;
  return (
    <span className={"inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-bold uppercase tracking-wide " + map[tone]}>
      {children}
    </span>
  );
}

/** iOS-style toggle with haptic. */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => { haptic("select"); onChange(!on); }}
      className="relative h-[26px] w-[44px] flex-none rounded-full transition-colors duration-200"
      style={{ background: on ? "var(--color-teal)" : "var(--color-surface-3)" }}
      role="switch"
      aria-checked={on}
    >
      <motion.span
        className="absolute top-[3px] h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: on ? 21 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 46 }}
      />
    </button>
  );
}

/** Labeled text input. */
export function InputField({ label, value, onChange, placeholder, type = "text", prefix, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; prefix?: ReactNode; hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-dim">{label}</span>
      <span className="flex items-center gap-2 rounded-[10px] border border-border bg-surface-2 px-3.5 py-3 transition-colors focus-within:border-teal">
        {prefix}
        <input
          className="w-full bg-transparent text-[14px] font-medium text-ink placeholder:text-faint focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
        />
      </span>
      {hint && <span className="mt-1 block text-[10.5px] text-faint">{hint}</span>}
    </label>
  );
}

/** Settings/control row: icon + title/sub, trailing control. */
export function ControlRow({ iconName, title, sub, trailing, onClick }: {
  iconName?: string; title: string; sub?: string; trailing?: ReactNode; onClick?: () => void;
}) {
  const Comp: "button" | "div" = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
      {iconName && <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-surface-2 text-ink"><Icon name={iconName} size={16} /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-ink">{title}</span>
        {sub && <span className="block truncate text-[11px] text-dim">{sub}</span>}
      </span>
      {trailing}
    </Comp>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-5 flex items-center justify-between">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-faint">{children}</div>
      {action}
    </div>
  );
}

/** Quick-action tile — liquid-glass face, iconsax Bulk icon. */
export function QuickAction({ icon: I, label, onClick }: { icon: IconsaxIcon; label: string; onClick?: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} transition={{ type: "spring", duration: 0.3, bounce: 0 }} onClick={() => { haptic("tap"); onClick?.(); }} className="flex flex-col items-center gap-1.5">
      <span className="glass-tile flex h-[54px] w-full items-center justify-center rounded-[15px]">
        <I size={23} variant="Bulk" color="var(--color-teal-2)" />
      </span>
      <span className="text-[10.5px] font-medium text-dim">{label}</span>
    </motion.button>
  );
}

/** Transaction / list row. Category drives the iconsax Bulk glyph + accent. */
export function TxnRow({ iconName, category, title, sub, amount, dir, chip, onClick }: {
  iconName?: string; category?: string; title: string; sub: string; amount: string; dir: "in" | "out"; chip?: ReactNode; onClick?: () => void;
}) {
  const c = CAT[category ?? ""] ?? { Icon: CardIcon, tint: dir === "in" ? "var(--acc-green)" : "var(--acc-slate)" };
  void iconName;
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${c.tint} 15%, transparent)` }}>
        <c.Icon size={19} variant="Bulk" color={c.tint} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-ink">{title}</span>
        <span className="block truncate text-[11.5px] text-dim">{sub}</span>
      </span>
      <span className="flex flex-none flex-col items-end gap-1">
        <span className={"tnum text-[14px] font-bold " + (dir === "in" ? "text-go" : "text-ink")}>
          {dir === "in" ? "+" : "−"}{amount}
        </span>
        {chip}
      </span>
    </motion.button>
  );
}

/**
 * Collapsible "what is this" explainer. Shows a teal info card with a close (X);
 * dismissing collapses it to a small "ⓘ What is this?" pill that re-expands on tap.
 * Wrap in a motion.div at the call site if you want the staggered entrance.
 */
export function Explainer({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <AnimatePresence mode="wait" initial={false}>
      {open ? (
        <motion.div
          key="card"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-4 overflow-hidden"
        >
          <div className="flex gap-3 rounded-[14px] border border-teal/25 bg-teal/8 p-3.5">
            <InfoCircle size={20} variant="Bulk" color="var(--color-teal-2)" className="mt-0.5 flex-none" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[12.5px] font-semibold text-ink">{title}</div>
                <button onClick={() => { haptic("tap"); setOpen(false); }} aria-label="Collapse" className="-mr-1 -mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full text-faint transition-colors hover:bg-teal/10"><X size={14} strokeWidth={2.2} /></button>
              </div>
              <div className="mt-0.5 text-[11.5px] leading-snug text-dim">{children}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="pill"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => { haptic("tap"); setOpen(true); }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/8 px-3 py-1.5 text-[11px] font-semibold text-teal-2"
        >
          <InfoCircle size={13} variant="Bulk" color="var(--color-teal-2)" /> What is this?
        </motion.button>
      )}
    </AnimatePresence>
  );
}
