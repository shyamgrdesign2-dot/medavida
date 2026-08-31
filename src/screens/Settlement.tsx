import { motion, type Variants } from "motion/react";
import { ArrowLeft2, Flash, DocumentDownload, TrendUp, ArrowRight2 } from "iconsax-react";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

const TODAY = { gross: 8240, fee: 164.8, net: 8075.2, count: 128 };
const MONTH = { gross: 38240, fee: 764.8, net: 37475.2 };
const DAYS = [
  { d: "Today · Aug 30", count: 128, net: 8075.2 },
  { d: "Aug 29", count: 96, net: 6002.4 },
  { d: "Aug 28", count: 110, net: 6890.5 },
  { d: "Aug 27", count: 84, net: 5127.6 },
];
const TODAY_ITEMS = [
  { id: "SGR-2831", prog: "Semaglutide 0.5mg", amt: 340 },
  { id: "SGR-2830", prog: "GLP-1 program", amt: 499 },
  { id: "SGR-2822", prog: "Lab panel", amt: 285 },
  { id: "SGR-2815", prog: "Consult", amt: 180 },
];

export function Settlement({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
          <div>
            <div className="font-display text-[18px] font-semibold text-ink">Settlement</div>
            <div className="text-[11.5px] text-dim">Zeva Pay · instant disbursement</div>
          </div>
        </div>
        <button onClick={() => haptic("tap")} aria-label="Download statement" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-dim"><DocumentDownload size={16} variant="Linear" color="currentColor" /></button>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {/* today hero — the value prop made concrete */}
        <motion.div variants={item} className="relative overflow-hidden rounded-[16px] border border-teal/25 bg-teal/8 p-4">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-faint">Today · {TODAY.count} payments</div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-dim">Collected</div>
              <div className="tnum font-display text-[22px] font-semibold text-ink">{money(TODAY.gross)}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-dim">Zeva Pay fee (2%)</div>
              <div className="tnum font-display text-[16px] font-semibold text-ink">−{money(TODAY.fee)}</div>
            </div>
          </div>
          <div className="my-3 border-t border-teal/20" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-2"><Flash size={15} variant="Bulk" color="currentColor" />Disbursed instantly</span>
            <span className="tnum font-display text-[20px] font-semibold text-ink">{money(TODAY.net)}</span>
          </div>
          <div className="mt-1.5 rounded-[9px] bg-teal/10 px-3 py-2 text-[11px] text-dim">A traditional processor would clear this in <span className="font-semibold text-ink">2–3 business days</span>. Zeva settled it to Operating ···· 5528 <span className="font-semibold text-teal-2">now</span>.</div>
        </motion.div>

        {/* month totals */}
        <motion.div variants={item} className="mt-3 grid grid-cols-3 gap-2.5">
          {[{ l: "Collected", v: MONTH.gross }, { l: "Fees", v: MONTH.fee }, { l: "Net", v: MONTH.net }].map((s) => (
            <div key={s.l} className="rounded-[12px] border border-border bg-surface p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">{s.l}</div>
              <div className="tnum mt-1 text-[15px] font-bold text-ink">{money0(s.v)}</div>
              <div className="text-[9.5px] text-faint">this month</div>
            </div>
          ))}
        </motion.div>

        {/* daily settlements */}
        <motion.div variants={item} className="mb-2 mt-6 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-faint"><TrendUp size={13} variant="Linear" color="currentColor" />Daily settlements</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {DAYS.map((d, i) => (
            <button key={d.d} onClick={() => haptic("tap")} className={"flex w-full items-center gap-3 py-3 text-left " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/10 text-teal-2"><Flash size={15} variant="Bulk" color="currentColor" /></span>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-ink">{d.d}</span>
                <span className="block text-[11px] text-dim">{d.count} payments · net</span>
              </span>
              <span className="tnum text-[13.5px] font-bold text-ink">{money(d.net)}</span>
              <ArrowRight2 size={15} variant="Linear" color="var(--color-faint)" />
            </button>
          ))}
        </motion.div>

        {/* today's line items */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Today's collections</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {TODAY_ITEMS.map((t, i) => (
            <div key={t.id} className={"flex items-center gap-3 py-3 " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-ink">Patient · {t.id}</span>
                <span className="block text-[11px] text-dim">{t.prog}</span>
              </span>
              <span className="tnum text-[13px] font-bold text-go">+{money(t.amt)}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
