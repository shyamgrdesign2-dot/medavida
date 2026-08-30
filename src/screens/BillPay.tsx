import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Add, TickCircle, ArrowRight2 } from "iconsax-react";
import { Icon, Chip, SectionTitle } from "@/components/ui";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { BottomSheet } from "@/components/BottomSheet";
import { NeoPopButton } from "@/components/NeoPopButton";
import { PayNewBill, CATEGORIES } from "./PayNewBill";
import { BILLS, CARDS, money, type Bill, type BillStatus } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const chipFor = (s: BillStatus) =>
  s === "upcoming" ? <Chip tone="warn">Upcoming</Chip> :
  s === "autopay" ? <Chip tone="pos">Autopay on</Chip> :
  s === "approval" ? <Chip tone="neg">Needs approval</Chip> :
  s === "paid" ? <Chip tone="pos"><TickCircle size={10} variant="Bulk" color="currentColor" />Paid</Chip> :
  <Chip tone="neutral">Scheduled</Chip>;

export function BillPay() {
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const [sel, setSel] = useState<Bill | null>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newCat, setNewCat] = useState<string | undefined>(undefined);
  const openNew = (cat?: string) => { haptic("tap"); setNewCat(cat); setShowNew(true); };

  const bills = useMemo(() => BILLS.map((b) => (paid[b.id] ? { ...b, status: "paid" as BillStatus } : b)), [paid]);
  const totalDue = bills.filter((b) => !paid[b.id] && b.status !== "autopay").reduce((s, b) => s + b.amount, 0);

  const open = (b: Bill) => { haptic("tap"); setDone(false); setCardIdx(0); setSel(b); };
  const pay = () => {
    haptic("success");
    setDone(true);
    setTimeout(() => { if (sel) setPaid((p) => ({ ...p, [sel.id]: true })); setSel(null); }, 1400);
  };

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-5 pb-28 pt-4">
      {/* header + total due */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-[22px] font-semibold tracking-tight text-ink">Bill Pay</div>
          <div className="text-[12px] text-dim">{bills.filter((b) => b.status !== "paid").length} bills this cycle</div>
        </div>
        <NeoPopButton depth={4} faceClassName="px-3.5 py-2.5 text-[12.5px] font-semibold" onClick={() => openNew()}><Add size={15} variant="Linear" color="currentColor" /> Add</NeoPopButton>
      </div>

      {/* due summary card with animated gradient */}
      <div className="relative mt-4 overflow-hidden rounded-[12px] border border-border bg-surface p-4">
        <AnimatedGradient tone="teal" opacity={0.85} />
        <div className="relative text-[10.5px] font-bold uppercase tracking-[0.14em] text-faint">Due this cycle</div>
        <div className="tnum relative mt-1 font-display text-[28px] font-semibold text-ink">{money(totalDue)}</div>
        <div className="relative mt-1 text-[11.5px] text-dim">across rent, vendors &amp; equipment</div>
      </div>

      {/* category tiles — up front (research: category grid, not a hidden entry) */}
      <SectionTitle action={<button onClick={() => openNew()} className="flex items-center gap-0.5 text-[11px] font-semibold text-teal-2">More <ArrowRight2 size={13} variant="Linear" color="currentColor" /></button>}>Pay a new bill</SectionTitle>
      <div className="grid grid-cols-5 gap-2">
        {CATEGORIES.map((c) => (
          <motion.button
            key={c.id}
            onClick={() => openNew(c.id)}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-center gap-1.5 rounded-[14px] p-2.5"
            style={{
              background: "linear-gradient(160deg, var(--glass-hi), transparent 46%), var(--glass-bg)",
              backdropFilter: "blur(14px) saturate(1.3)",
              WebkitBackdropFilter: "blur(14px) saturate(1.3)",
              boxShadow: "inset 0 1px 0 var(--glass-hi), inset 0 0 0 1px var(--glass-brd), var(--shadow-card)",
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/12 text-teal-2"><c.icon size={16} variant="Bulk" color="var(--color-teal-2)" /></span>
            <span className="text-[9.5px] font-semibold text-dim">{c.label}</span>
          </motion.button>
        ))}
      </div>

      {/* bill list */}
      <SectionTitle>Recurring bills</SectionTitle>
      <div className="rounded-[12px] border border-border bg-surface px-3.5">
        {bills.map((b, i) => (
          <motion.button
            key={b.id}
            onClick={() => open(b)}
            whileTap={{ scale: 0.96 }}
            className={"flex w-full items-center gap-3 py-3 text-left " + (i > 0 ? "border-t border-border-soft" : "")}
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[9px] bg-surface-2 text-ink"><Icon name={b.icon} size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-ink">{b.name}</span>
              <span className="block truncate text-[11.5px] text-dim">{b.sub} · {b.due}</span>
            </span>
            <span className="flex flex-none flex-col items-end gap-1">
              <span className="tnum text-[13.5px] font-bold text-ink">{money(b.amount)}</span>
              {chipFor(b.status)}
            </span>
          </motion.button>
        ))}
      </div>

      {/* pay-a-bill sheet */}
      <BottomSheet open={!!sel} onClose={() => setSel(null)} title={done ? undefined : "Pay bill"}>
        {sel && (
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" className="flex flex-col items-center py-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div className="flex h-16 w-16 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
                  <TickCircle size={30} variant="Bulk" color="var(--color-go)" />
                </motion.div>
                <div className="mt-4 font-display text-[20px] font-semibold text-ink">Paid {money(sel.amount)}</div>
                <div className="mt-1 text-[12.5px] text-dim">{sel.name} · settled instantly</div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-2 p-3.5">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[9px] bg-surface text-ink"><Icon name={sel.icon} size={20} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold text-ink">{sel.name}</div>
                    <div className="text-[11.5px] text-dim">{sel.sub} · {sel.due}</div>
                  </div>
                  <div className="tnum font-display text-[20px] font-semibold text-ink">{money(sel.amount)}</div>
                </div>

                <div className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Pay from</div>
                <div className="flex flex-col gap-2">
                  {CARDS.filter((c) => c.type !== "virtual").map((c, i) => {
                    const on = cardIdx === i;
                    return (
                      <button key={c.id} onClick={() => { haptic("tap"); setCardIdx(i); }} className={"flex items-center gap-3 rounded-[9px] border p-3 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface-2")}>
                        <span className="flex h-9 w-12 flex-none items-center justify-center rounded-md" style={{ background: c.variant === "credit" ? "linear-gradient(135deg,#0c211d,#05423a)" : "linear-gradient(135deg,#16201f,#08130f)", boxShadow: "inset 0 0 0 1px rgba(35,255,237,0.2)" }}>
                          <span className="font-mono text-[9px] font-bold text-teal-2">{c.last4}</span>
                        </span>
                        <span className="flex-1">
                          <span className="block text-[13px] font-semibold text-ink">{c.label}</span>
                          <span className="block font-mono text-[10.5px] text-dim">•••• {c.last4} · {c.type}</span>
                        </span>
                        <span className={"flex h-5 w-5 items-center justify-center rounded-full border " + (on ? "border-teal bg-teal text-on-teal" : "border-border")}>{on && <TickCircle size={12} variant="Bulk" color="currentColor" />}</span>
                      </button>
                    );
                  })}
                </div>

                <NeoPopButton onClick={pay} className="mt-5 w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
                  Pay {money(sel.amount)} <ArrowRight2 size={18} variant="Linear" color="currentColor" />
                </NeoPopButton>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </BottomSheet>

      {/* pay a new bill flow */}
      <PayNewBill open={showNew} startCategory={newCat} onClose={() => setShowNew(false)} onPaid={() => { /* prototype: settled */ }} />
    </div>
  );
}
