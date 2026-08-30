import { useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowLeft2, Add, TrendUp, RefreshCircle, Danger, ArrowRight2, Repeat } from "iconsax-react";
import { NeoPopButton } from "@/components/NeoPopButton";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

const PLANS = [
  { id: "glp1", name: "GLP-1 Weight Management", price: 299, members: 42, next: "Sep 1", tint: "#23ffed" },
  { id: "peptide", name: "Peptide Therapy", price: 189, members: 18, next: "Sep 5", tint: "#6ea8ff" },
  { id: "labs", name: "Functional Labs membership", price: 99, members: 14, next: "Sep 1", tint: "#2fd07a" },
];
const MRR = PLANS.reduce((s, p) => s + p.price * p.members, 0);
const MEMBERS = PLANS.reduce((s, p) => s + p.members, 0);

export function Memberships({ onBack }: { onBack: () => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { haptic("tap"); setToast(m); setTimeout(() => setToast(null), 1900); };
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
          <div>
            <div className="font-display text-[18px] font-semibold text-ink">Memberships</div>
            <div className="text-[11.5px] text-dim">Recurring patient programs</div>
          </div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {/* MRR hero */}
        <motion.div variants={item} className="relative overflow-hidden rounded-[16px] border border-teal/25 bg-teal/8 p-4">
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-faint"><Repeat size={12} variant="Linear" color="currentColor" />Monthly recurring revenue</div>
          <div className="tnum mt-1.5 font-display text-[30px] font-semibold text-ink">{money0(MRR)}<span className="text-[15px] font-medium text-dim">/mo</span></div>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-go/14 px-2 py-0.5 text-[11px] font-bold text-go"><TrendUp size={11} variant="Bulk" color="currentColor" />12%</span>
            <span className="text-[11.5px] text-dim">{MEMBERS} active members · auto-charged on file</span>
          </div>
        </motion.div>

        {/* dunning alert — failed recurring charges (recovered revenue) */}
        <motion.button variants={item} onClick={() => haptic("tap")} className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-stop/30 bg-stop/8 p-3.5 text-left">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-stop/15 text-stop"><Danger size={18} variant="Bulk" color="currentColor" /></span>
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-ink">2 charges failed</span>
            <span className="block text-[11.5px] text-dim">Card expired · $598 at risk</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-stop/40 px-2.5 py-1 text-[11px] font-bold text-stop"><RefreshCircle size={12} variant="Linear" color="currentColor" />Retry</span>
        </motion.button>

        {/* plans */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Active plans</motion.div>
        <div className="space-y-3">
          {PLANS.map((p) => (
            <motion.button key={p.id} variants={item} onClick={() => haptic("tap")} className="flex w-full items-center gap-3 rounded-[14px] border border-border bg-surface p-4 text-left">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px]" style={{ background: `color-mix(in oklab, ${p.tint} 18%, transparent)`, color: p.tint }}><Repeat size={19} variant="Bulk" color="currentColor" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-ink">{p.name}</span>
                <span className="block text-[11.5px] text-dim">{p.members} members · next charge {p.next}</span>
              </span>
              <span className="flex flex-none flex-col items-end">
                <span className="tnum text-[14px] font-bold text-ink">{money0(p.price)}<span className="text-[11px] font-medium text-dim">/mo</span></span>
                <span className="tnum text-[10.5px] text-faint">{money0(p.price * p.members)} MRR</span>
              </span>
              <ArrowRight2 size={16} variant="Linear" color="var(--color-faint)" className="flex-none" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="flex-none px-5 pb-8 pt-2">
        <NeoPopButton onClick={() => flash("New plan — set price & enroll members")} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          <Add size={17} variant="Linear" color="currentColor" /> New plan
        </NeoPopButton>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-center text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}
