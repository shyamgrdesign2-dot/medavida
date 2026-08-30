import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";
import {
  Notification, ShieldTick, ShieldSecurity, Bank, MessageQuestion, Logout, Verify,
  Sun, Moon, Monitor, DocumentText, Repeat, Flash, ReceiptText, Book1, Profile2User, Calculator,
  type Icon as IconsaxIcon,
} from "iconsax-react";
import { Squircle } from "@/lib/squircle";
import { PatternAvatar, Toggle, ControlRow } from "@/components/ui";
import { CLINIC, money } from "@/lib/data";
import { haptic } from "@/lib/haptics";
import { useThemePref, setThemePref, type ThemePref } from "@/lib/theme";

const ACCOUNTS = [
  { id: "operating", name: "Operating", num: "••2210", bal: 128450.2 },
  { id: "payroll", name: "Payroll", num: "••2211", bal: 41200 },
  { id: "supplies", name: "Supplies & Inventory", num: "••2212", bal: 9860 },
  { id: "tax", name: "Tax reserve", num: "••2213", bal: 14730 },
];

// the product features — surfaced as a compact 3-up grid, not buried in settings
const MANAGE: { k: string; icon: IconsaxIcon; tint: string; title: string }[] = [
  { k: "invoices", icon: DocumentText, tint: "#23ffed", title: "Invoices" },
  { k: "memberships", icon: Repeat, tint: "#6ea8ff", title: "Memberships" },
  { k: "settlement", icon: Flash, tint: "#2fd07a", title: "Settlement" },
  { k: "reserves", icon: Bank, tint: "#f7b955", title: "Reserves" },
  { k: "receipts", icon: ReceiptText, tint: "#7de0c0", title: "Receipts" },
  { k: "accounting", icon: Book1, tint: "#6ea8ff", title: "Books" },
  { k: "staff", icon: Profile2User, tint: "#2fd07a", title: "Team" },
  { k: "vendors", icon: Calculator, tint: "#f7b955", title: "1099" },
  { k: "trust", icon: ShieldSecurity, tint: "#23ffed", title: "Security" },
];

const THEMES: { id: ThemePref; label: string; icon: IconsaxIcon }[] = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

function AppearanceControl() {
  const pref = useThemePref();
  return (
    <div className="relative grid grid-cols-3 gap-1 rounded-[12px] border border-border bg-surface-2 p-1">
      {THEMES.map((t) => {
        const on = pref === t.id;
        return (
          <button key={t.id} onClick={() => { haptic("select"); setThemePref(t.id); }} className="relative flex items-center justify-center gap-1.5 rounded-[9px] py-2.5">
            {on && <motion.span layoutId="themepill" className="absolute inset-0 rounded-[9px] border border-teal/40 bg-teal/12" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
            <span className="relative"><t.icon size={15} variant={on ? "Bulk" : "Linear"} color={on ? "var(--color-teal-2)" : "var(--color-dim)"} /></span>
            <span className={"relative text-[12.5px] font-semibold " + (on ? "text-ink" : "text-dim")}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FeatureCard({ icon: Icon, tint, title, onClick }: { icon: IconsaxIcon; tint: string; title: string; onClick?: () => void }) {
  return (
    <motion.button
      variants={item}
      whileTap={{ scale: 0.96 }}
      onClick={() => { haptic("tap"); onClick?.(); }}
      className="flex flex-col items-center gap-2 rounded-[15px] px-2 py-3.5"
      style={{
        background: "linear-gradient(160deg, var(--glass-hi), transparent 46%), var(--glass-bg)",
        backdropFilter: "blur(14px) saturate(1.3)",
        WebkitBackdropFilter: "blur(14px) saturate(1.3)",
        boxShadow: "inset 0 1px 0 var(--glass-hi), inset 0 0 0 1px var(--glass-brd), var(--shadow-card)",
      }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[13px]" style={{ background: `color-mix(in oklab, ${tint} 20%, transparent)` }}><Icon size={21} variant="Bulk" color={tint} /></span>
      <span className="w-full truncate text-center text-[11px] font-semibold text-ink">{title}</span>
    </motion.button>
  );
}

export function More({ onOpen }: { onOpen?: (k: string) => void }) {
  const [notif, setNotif] = useState(true);
  const [biometric, setBiometric] = useState(true);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar h-full overflow-y-auto px-5 pb-28 pt-4">
      {/* profile */}
      <motion.div variants={item}>
        <Squircle radius={16} className="flex items-center gap-3.5 border border-border bg-surface p-4">
          <PatternAvatar size={52} label="MF" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-display text-[16px] font-semibold text-ink">{CLINIC.name}</span>
              <span className="flex-none"><Verify size={15} variant="Bulk" color="var(--color-teal-2)" /></span>
            </div>
            <div className="text-[12px] text-dim">Owner · {CLINIC.owner}</div>
          </div>
          <ChevronRight size={18} className="text-faint" />
        </Squircle>
      </motion.div>

      {/* approvals alert */}
      <motion.button variants={item} onClick={() => { haptic("tap"); onOpen?.("approvals"); }} className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-caution/30 bg-caution/8 p-3.5 text-left">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-caution/15"><ShieldTick size={20} variant="Bulk" color="var(--color-caution)" /></span>
        <span className="flex-1">
          <span className="block text-[13.5px] font-semibold text-ink">Approvals</span>
          <span className="block text-[11.5px] text-dim">Payments waiting on your sign-off</span>
        </span>
        <span className="rounded-full bg-caution px-2 py-0.5 text-[11px] font-bold text-[#1a1205]">3</span>
        <ChevronRight size={17} className="text-faint" />
      </motion.button>

      {/* manage — bento grid of features */}
      <motion.div variants={item} className="mb-2.5 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Manage</motion.div>
      <div className="grid grid-cols-3 gap-2.5">
        {MANAGE.map((m) => <FeatureCard key={m.k} icon={m.icon} tint={m.tint} title={m.title} onClick={() => onOpen?.(m.k)} />)}
      </div>

      {/* accounts */}
      <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Accounts</motion.div>
      <motion.div variants={item}>
        <Squircle radius={16} className="border border-border bg-surface px-4">
          {ACCOUNTS.map((a, i) => (
            <button key={a.id} onClick={() => { haptic("tap"); onOpen?.("reserves"); }} className={"flex w-full items-center gap-3 py-3 text-left " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-surface-2"><Bank size={17} variant="Bulk" color="var(--color-teal-2)" /></span>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-ink">{a.name}</span>
                <span className="block font-mono text-[10.5px] text-dim">{a.num}</span>
              </span>
              <span className="tnum text-[13px] font-bold text-ink">{money(a.bal)}</span>
            </button>
          ))}
        </Squircle>
      </motion.div>

      {/* appearance */}
      <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Appearance</motion.div>
      <motion.div variants={item}><AppearanceControl /></motion.div>

      {/* preferences */}
      <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Preferences</motion.div>
      <motion.div variants={item}>
        <Squircle radius={16} className="border border-border bg-surface px-4">
          <ControlRow title="Push notifications" sub="Payments, approvals, alerts" trailing={<Toggle on={notif} onChange={setNotif} />} />
          <div className="border-t border-border-soft" />
          <ControlRow title="Face ID & PIN" sub="Unlock with biometrics" trailing={<Toggle on={biometric} onChange={setBiometric} />} />
          <div className="border-t border-border-soft" />
          <ControlRow title="Statements & tax docs" onClick={() => haptic("tap")} trailing={<ChevronRight size={17} className="text-faint" />} />
          <div className="border-t border-border-soft" />
          <ControlRow title="Help & support" onClick={() => haptic("tap")} trailing={<ChevronRight size={17} className="text-faint" />} />
        </Squircle>
      </motion.div>

      <motion.button variants={item} onClick={() => haptic("tap")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] border border-stop/30 bg-stop/8 py-3.5 text-[13.5px] font-semibold text-stop">
        <Logout size={16} variant="Linear" color="var(--color-stop)" /> Sign out
      </motion.button>
      <div className="mt-4 flex items-center justify-center gap-4"><Notification size={15} variant="Linear" color="var(--color-faint)" /><MessageQuestion size={15} variant="Linear" color="var(--color-faint)" /></div>
      <div className="mt-3 text-center text-[10.5px] text-faint">Zeva · from MedaVida · v0.1</div>
    </motion.div>
  );
}
