import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ChevronLeft, Check, RefreshCw, Download, Plug, ChevronRight, ArrowRight, Loader } from "lucide-react";
import { Toggle } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { haptic } from "@/lib/haptics";

const TIMING = [
  { id: "approval", label: "On approval" },
  { id: "creation", label: "On creation" },
  { id: "manual", label: "Manual" },
];

// how Zeva categories map to the general ledger
const MAP = [
  { from: "Patient payments", to: "Sales income" },
  { from: "Suppliers & Rx", to: "COGS · Medical supplies" },
  { from: "Labs (Rupa)", to: "COGS · Lab fees" },
  { from: "Payroll", to: "Payroll expenses" },
  { from: "Rent", to: "Rent or lease" },
  { from: "Utilities", to: "Utilities" },
];

const SYNCS = [
  { when: "Today · 9:12 AM", n: 128, ok: true },
  { when: "Aug 29", n: 96, ok: true },
  { when: "Aug 28", n: 110, ok: true },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function AccountingExport({ onBack }: { onBack: () => void }) {
  const [auto, setAuto] = useState(true);
  const [timing, setTiming] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sync = () => {
    if (syncing) return;
    haptic("tap"); setSyncing(true);
    setTimeout(() => {
      setSyncing(false); haptic("success");
      setToast("Synced 342 transactions to QuickBooks");
      setTimeout(() => setToast(null), 1900);
    }, 1300);
  };

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">Accounting export</div>
          <div className="text-[11.5px] text-dim">Keep your books in sync</div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {/* connection */}
        <motion.div variants={item} className="rounded-[16px] border border-teal/25 bg-teal/8 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[12px] bg-teal/15 text-teal-2"><Plug size={20} strokeWidth={2.2} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">QuickBooks Online <Check size={14} className="text-go" strokeWidth={3} /></div>
              <div className="truncate text-[11.5px] text-dim">Meridian Functional Health · synced 9:12 AM</div>
            </div>
          </div>
          <div className="mt-3.5 flex items-center justify-between border-t border-teal/15 pt-3">
            <span className="text-[12.5px] font-medium text-ink">Auto-sync</span>
            <Toggle on={auto} onChange={setAuto} />
          </div>
          {auto && (
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-[11px] border border-border bg-surface-2 p-1">
              {TIMING.map((t, i) => {
                const on = timing === i;
                return (
                  <button key={t.id} onClick={() => { haptic("select"); setTiming(i); }} className="relative rounded-[8px] py-2 text-center">
                    {on && <motion.span layoutId="synctiming" className="absolute inset-0 rounded-[8px] border border-teal/40 bg-teal/12" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
                    <span className={"relative text-[11.5px] font-semibold " + (on ? "text-ink" : "text-dim")}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* category → GL mapping */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Category mapping</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {MAP.map((m, i) => (
            <button key={m.from} onClick={() => haptic("tap")} className={"flex w-full items-center gap-2 py-3 text-left " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex-1 truncate text-[12.5px] font-semibold text-ink">{m.from}</span>
              <ArrowRight size={13} className="flex-none text-faint" />
              <span className="flex-1 truncate text-right text-[12px] text-dim">{m.to}</span>
            </button>
          ))}
        </motion.div>

        {/* other export options */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Other destinations</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          <button onClick={() => haptic("tap")} className="flex w-full items-center gap-3 py-3 text-left">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-surface-2 text-ink"><Plug size={16} strokeWidth={2} /></span>
            <span className="flex-1"><span className="block text-[13px] font-semibold text-ink">Xero</span><span className="block text-[11px] text-dim">Not connected</span></span>
            <span className="rounded-full border border-teal/40 px-2.5 py-1 text-[11px] font-bold text-teal-2">Connect</span>
          </button>
          <div className="border-t border-border-soft" />
          <button onClick={() => { haptic("tap"); setToast("CSV exported to Files"); setTimeout(() => setToast(null), 1900); }} className="flex w-full items-center gap-3 py-3 text-left">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-surface-2 text-ink"><Download size={16} strokeWidth={2} /></span>
            <span className="flex-1"><span className="block text-[13px] font-semibold text-ink">Export CSV</span><span className="block text-[11px] text-dim">This month · 342 transactions</span></span>
            <ChevronRight size={16} className="text-faint" />
          </button>
        </motion.div>

        {/* recent syncs */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Recent syncs</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {SYNCS.map((s, i) => (
            <div key={s.when} className={"flex items-center gap-3 py-3 " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-go/12 text-go"><Check size={15} strokeWidth={2.6} /></span>
              <span className="flex-1 text-[12.5px] font-medium text-ink">{s.when}</span>
              <span className="text-[11.5px] text-dim">{s.n} synced</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex-none px-5 pb-8 pt-2">
        <NeoPopButton onClick={sync} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          {syncing ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-flex"><Loader size={17} strokeWidth={2.4} /></motion.span> Syncing…</> : <><RefreshCw size={17} strokeWidth={2.4} /> Sync now</>}
        </NeoPopButton>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-6">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-center text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}
