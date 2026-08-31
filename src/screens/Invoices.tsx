import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft2, Add, TickCircle, Send2, DocumentText } from "iconsax-react";
import { Chip } from "@/components/ui";
import { BottomSheet } from "@/components/BottomSheet";
import { NeoPopButton } from "@/components/NeoPopButton";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

type Status = "paid" | "sent" | "viewed" | "overdue" | "draft";
interface Line { label: string; amount: number }
interface Invoice { id: string; patient: string; summary: string; amount: number; status: Status; due: string; lines: Line[] }

const INVOICES: Invoice[] = [
  { id: "INV-1042", patient: "SGR-2831", summary: "Visit + Semaglutide + labs", amount: 520, status: "overdue", due: "Due Aug 20", lines: [{ label: "Office visit", amount: 180 }, { label: "Semaglutide 0.5mg", amount: 220 }, { label: "Lab panel · Rupa", amount: 120 }] },
  { id: "INV-1041", patient: "SGR-2830", summary: "GLP-1 program · month 2", amount: 499, status: "viewed", due: "Due Sep 2", lines: [{ label: "GLP-1 program", amount: 499 }] },
  { id: "INV-1040", patient: "SGR-2822", summary: "Lab panel · Rupa Health", amount: 285, status: "sent", due: "Due Sep 5", lines: [{ label: "Comprehensive panel", amount: 285 }] },
  { id: "INV-1039", patient: "SGR-2815", summary: "Consult + supplements", amount: 340, status: "paid", due: "Paid Aug 26", lines: [{ label: "Consult", amount: 180 }, { label: "Supplements · Fullscript", amount: 160 }] },
  { id: "INV-1038", patient: "SGR-2808", summary: "Peptide therapy", amount: 189, status: "paid", due: "Paid Aug 24", lines: [{ label: "Peptide therapy", amount: 189 }] },
];

const chipFor = (s: Status) =>
  s === "paid" ? <Chip tone="pos"><TickCircle size={10} variant="Bulk" color="currentColor" />Paid</Chip> :
  s === "overdue" ? <Chip tone="neg">Overdue</Chip> :
  s === "viewed" ? <Chip tone="accent">Viewed</Chip> :
  s === "sent" ? <Chip tone="neutral">Sent</Chip> :
  <Chip tone="warn">Draft</Chip>;

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function Invoices({ onBack }: { onBack: () => void }) {
  const [sel, setSel] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const outstanding = INVOICES.filter((i) => i.status !== "paid" && i.status !== "draft").reduce((s, i) => s + i.amount, 0);
  const overdue = INVOICES.filter((i) => i.status === "overdue").length;
  const paidMonth = INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0) + 11371;

  const ping = (m: string) => { haptic("success"); setSel(null); setToast(m); setTimeout(() => setToast(null), 1800); };

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
          <div className="font-display text-[18px] font-semibold text-ink">Invoices</div>
        </div>
        <NeoPopButton depth={4} faceClassName="px-3.5 py-2.5 text-[12.5px] font-semibold" onClick={() => { haptic("tap"); setToast("New invoice — draft started"); setTimeout(() => setToast(null), 1800); }}><Add size={15} variant="Linear" color="currentColor" /> New</NeoPopButton>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {/* summary */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[12px] border border-border bg-surface p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">Outstanding</div>
            <div className="tnum mt-1 text-[15px] font-bold text-ink">{money0(outstanding)}</div>
          </div>
          <div className="rounded-[12px] border border-border bg-surface p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">Overdue</div>
            <div className="tnum mt-1 text-[15px] font-bold text-stop">{overdue}</div>
          </div>
          <div className="rounded-[12px] border border-border bg-surface p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-faint">Paid · mo</div>
            <div className="tnum mt-1 text-[15px] font-bold text-ink">{money0(paidMonth)}</div>
          </div>
        </motion.div>

        {/* list */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">All invoices</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {INVOICES.map((inv, i) => (
            <button key={inv.id} onClick={() => { haptic("tap"); setSel(inv); }} className={"flex w-full items-center gap-3 py-3 text-left " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-surface-2 text-teal-2"><DocumentText size={17} variant="Bulk" color="currentColor" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-ink">{inv.patient} · {inv.id}</span>
                <span className="block truncate text-[11.5px] text-dim">{inv.summary} · {inv.due}</span>
              </span>
              <span className="flex flex-none flex-col items-end gap-1">
                <span className="tnum text-[13.5px] font-bold text-ink">{money(inv.amount)}</span>
                {chipFor(inv.status)}
              </span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* invoice detail */}
      <BottomSheet open={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.id}` : undefined}>
        {sel && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-ink">Patient · {sel.patient}</div>
                <div className="text-[11.5px] text-dim">{sel.due}</div>
              </div>
              {chipFor(sel.status)}
            </div>

            <div className="mt-4 rounded-[12px] border border-border bg-surface-2 px-3.5">
              {sel.lines.map((l, i) => (
                <div key={l.label} className={"flex items-center justify-between py-2.5 " + (i > 0 ? "border-t border-border-soft" : "")}>
                  <span className="text-[13px] text-ink">{l.label}</span>
                  <span className="tnum text-[13px] font-semibold text-ink">{money(l.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border py-3">
                <span className="text-[13px] font-bold text-ink">Total</span>
                <span className="tnum text-[15px] font-bold text-ink">{money(sel.amount)}</span>
              </div>
            </div>

            {sel.status !== "paid" && (
              <div className="mt-4 flex gap-2.5">
                <button onClick={() => ping(`Reminder sent to ${sel.patient}`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-[11px] border border-border py-3.5 text-[13.5px] font-semibold text-dim">
                  <Send2 size={15} variant="Linear" color="currentColor" /> Send reminder
                </button>
                <NeoPopButton onClick={() => ping(`${sel.id} marked paid`)} className="flex-1" faceClassName="px-4 py-3 text-[13.5px] font-semibold">
                  <TickCircle size={15} variant="Bulk" color="currentColor" /> Mark paid
                </NeoPopButton>
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}
