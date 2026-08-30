import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft2, Bank, Flash, InfoCircle } from "iconsax-react";
import { Toggle } from "@/components/ui";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

interface Bucket { id: string; name: string; job: string; pct: number; bal: number; tint: string }
const BUCKETS: Bucket[] = [
  { id: "operating", name: "Operating", job: "Day-to-day spend", pct: 50, bal: 128450.2, tint: "#23ffed" },
  { id: "payroll", name: "Payroll", job: "Staff wages", pct: 20, bal: 41200, tint: "#6ea8ff" },
  { id: "supplies", name: "Rx supply float", job: "Fullscript · Rupa · McKesson", pct: 15, bal: 9860, tint: "#f7b955" },
  { id: "tax", name: "Tax reserve", job: "Set aside for the IRS", pct: 15, bal: 14730, tint: "#2fd07a" },
];
const TODAY_NET = 8075.2; // from settlement — what auto-split today

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function Reserves({ onBack }: { onBack: () => void }) {
  const [on, setOn] = useState(true);

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">Reserves</div>
          <div className="text-[11.5px] text-dim">Auto-split every dollar you collect</div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {/* auto-split hero */}
        <motion.div variants={item} className="rounded-[16px] border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink"><Flash size={15} variant="Bulk" color="var(--color-teal-2)" />Auto-split</div>
            <Toggle on={on} onChange={setOn} />
          </div>
          {/* stacked allocation bar */}
          <div className="mt-3 flex h-3 overflow-hidden rounded-full">
            {BUCKETS.map((b) => (
              <div key={b.id} style={{ width: `${b.pct}%`, background: b.tint }} className="h-full" />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {BUCKETS.map((b) => (
              <span key={b.id} className="flex items-center gap-1.5 text-[11px] text-dim">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.tint }} />{b.name} <span className="font-semibold text-ink">{b.pct}%</span>
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 rounded-[9px] bg-teal/8 px-3 py-2 text-[11px] text-dim">
            <InfoCircle size={13} variant="Linear" color="var(--color-teal-2)" className="flex-none" />
            {on ? <>Today <span className="font-semibold text-ink">{money(TODAY_NET)}</span> collected was auto-allocated across your reserves.</> : "Auto-split is off — collections land only in Operating."}
          </div>
        </motion.div>

        {/* buckets */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Your reserves</motion.div>
        <div className="space-y-3">
          {BUCKETS.map((b) => (
            <motion.button key={b.id} variants={item} onClick={() => haptic("tap")} className="w-full rounded-[14px] border border-border bg-surface p-4 text-left">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px]" style={{ background: `color-mix(in oklab, ${b.tint} 18%, transparent)`, color: b.tint }}><Bank size={18} variant="Bulk" color="currentColor" /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-ink">{b.name}</div>
                  <div className="truncate text-[11.5px] text-dim">{b.job}</div>
                </div>
                <div className="text-right">
                  <div className="tnum text-[14px] font-bold text-ink">{money0(b.bal)}</div>
                  <div className="text-[10.5px] text-faint">{b.pct}% of inflow</div>
                </div>
              </div>
              {/* allocation of today's split */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <motion.div className="h-full rounded-full" style={{ background: b.tint }} initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
                </div>
                <span className="tnum text-[10.5px] text-faint">+{money0((TODAY_NET * b.pct) / 100)} today</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
