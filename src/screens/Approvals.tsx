import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Check, X, ShieldCheck, Clock } from "lucide-react";
import { Icon } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

interface Pending {
  id: string; name: string; sub: string; icon: string; amount: number;
  requester: string; rule: string;
}
const PENDING: Pending[] = [
  { id: "mck", name: "McKesson Medical", sub: "Rx wholesale · invoice #4471", icon: "Truck", amount: 3850, requester: "Sara · front desk", rule: "Over $2,000 · owner sign-off" },
  { id: "quest", name: "Quest Diagnostics", sub: "Lab panel batch · new vendor", icon: "HeartPulse", amount: 680, requester: "Jon · office manager", rule: "New vendor · first payment" },
  { id: "payroll", name: "Staff payroll", sub: "Semi-monthly · 4 employees", icon: "Users", amount: 9820, requester: "Bookkeeper", rule: "Payroll run · owner sign-off" },
];

export function Approvals({ onBack }: { onBack: () => void }) {
  const [queue, setQueue] = useState(PENDING);
  const [toast, setToast] = useState<string | null>(null);

  const act = (id: string, approved: boolean) => {
    haptic(approved ? "success" : "tap");
    const item = queue.find((q) => q.id === id);
    setToast(`${item?.name} ${approved ? "approved" : "rejected"}`);
    setQueue((q) => q.filter((x) => x.id !== id));
    setTimeout(() => setToast(null), 1800);
  };

  const total = queue.reduce((s, q) => s + q.amount, 0);

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">Approvals</div>
          <div className="text-[11.5px] text-dim">{queue.length ? `${queue.length} pending · ${money(total)}` : "Nothing waiting"}</div>
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8 pt-4">
        <AnimatePresence mode="popLayout">
          {queue.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="mb-3 rounded-[14px] border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[11px] bg-surface-2 text-ink"><Icon name={p.icon} size={19} /></span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold text-ink">{p.name}</div>
                  <div className="truncate text-[11.5px] text-dim">{p.sub}</div>
                </div>
                <div className="tnum font-display text-[18px] font-semibold text-ink">{money(p.amount)}</div>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-[9px] bg-caution/8 px-3 py-2">
                <ShieldCheck size={14} className="flex-none text-caution" strokeWidth={2.2} />
                <span className="text-[11px] text-dim">{p.rule}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-faint"><Clock size={12} strokeWidth={2} /> Requested by {p.requester}</div>

              <div className="mt-3.5 flex gap-2.5">
                <button onClick={() => act(p.id, false)} className="flex flex-1 items-center justify-center gap-1.5 rounded-[11px] border border-border py-3 text-[13.5px] font-semibold text-dim">
                  <X size={15} strokeWidth={2.4} /> Reject
                </button>
                <NeoPopButton onClick={() => act(p.id, true)} className="flex-1" faceClassName="px-4 py-3 text-[13.5px] font-semibold">
                  <Check size={15} strokeWidth={2.6} /> Approve
                </NeoPopButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {queue.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-16">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-go/15 text-go"><Check size={32} strokeWidth={3} /></span>
            <div className="mt-4 font-display text-[19px] font-semibold text-ink">All caught up</div>
            <div className="mt-1 text-[12.5px] text-dim">No payments waiting on you</div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          >
            <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
