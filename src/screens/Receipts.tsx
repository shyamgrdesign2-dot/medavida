import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft2, Camera, TickCircle, Paperclip, Danger , InfoCircle} from "iconsax-react";
import { Icon } from "@/components/ui";
import { money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

interface Row { id: string; name: string; icon: string; amount: number; when: string; cat: string; has: boolean }
const INITIAL: Row[] = [
  { id: "r1", name: "McKesson Medical", icon: "Truck", amount: 3850, when: "Aug 24", cat: "Rx wholesale", has: false },
  { id: "r2", name: "Rupa Health", icon: "HeartPulse", amount: 420, when: "Aug 26", cat: "Labs", has: false },
  { id: "r3", name: "Amazon Business", icon: "Truck", amount: 128, when: "Aug 25", cat: "Office supplies", has: false },
  { id: "r4", name: "Fullscript", icon: "Pill", amount: 1240.5, when: "Aug 29", cat: "Supplements", has: true },
  { id: "r5", name: "Texas Gas Service", icon: "Zap", amount: 64.2, when: "Aug 27", cat: "Utilities", has: true },
  { id: "r6", name: "City of Austin", icon: "Zap", amount: 412.6, when: "Aug 27", cat: "Electricity", has: true },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function Receipts({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState(INITIAL);
  const [toast, setToast] = useState<string | null>(null);

  const missing = rows.filter((r) => !r.has);
  const add = (id: string) => {
    haptic("success");
    const r = rows.find((x) => x.id === id);
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, has: true } : x)));
    setToast(`Receipt added · auto-matched to ${r?.name}`);
    setTimeout(() => setToast(null), 1900);
  };

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">Receipts</div>
          <div className="text-[11.5px] text-dim">Snap once · auto-matched to spend</div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {/* what this is — plain-language explainer */}
        <motion.div variants={item} className="mb-4 flex gap-3 rounded-[14px] border border-teal/25 bg-teal/8 p-3.5">
          <InfoCircle size={20} variant="Bulk" color="var(--color-teal-2)" className="mt-0.5 flex-none" />
          <div>
            <div className="text-[12.5px] font-semibold text-ink">Why capture receipts?</div>
            <div className="mt-0.5 text-[11.5px] leading-snug text-dim">Snap or forward a receipt and Zeva matches it to the card charge automatically — so every expense is documented for taxes and audits. Anything flagged is a charge still missing its receipt.</div>
          </div>
        </motion.div>

        {/* missing alert */}
        {missing.length > 0 && (
          <motion.div variants={item} className="flex items-center gap-3 rounded-[14px] border border-caution/30 bg-caution/8 p-3.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-caution/15 text-caution"><Danger size={18} variant="Bulk" color="currentColor" /></span>
            <span className="flex-1">
              <span className="block text-[13px] font-semibold text-ink">{missing.length} missing receipts</span>
              <span className="block text-[11.5px] text-dim">{money(missing.reduce((s, r) => s + r.amount, 0))} needs a receipt for the books</span>
            </span>
          </motion.div>
        )}
        {missing.length === 0 && (
          <motion.div variants={item} className="flex items-center gap-3 rounded-[14px] border border-go/30 bg-go/8 p-3.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-go/15 text-go"><TickCircle size={20} variant="Bulk" color="var(--color-go)" /></span>
            <span className="text-[13px] font-semibold text-ink">All spend has receipts</span>
          </motion.div>
        )}

        {/* list */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Card &amp; supplier spend</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {rows.map((r, i) => (
            <div key={r.id} className={"flex items-center gap-3 py-3 " + (i > 0 ? "border-t border-border-soft" : "")}>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-surface-2 text-ink"><Icon name={r.icon} size={17} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-ink">{r.name}</span>
                <span className="block truncate text-[11.5px] text-dim">{r.cat} · {r.when}</span>
              </span>
              <span className="tnum flex-none text-[13.5px] font-bold text-ink">{money(r.amount)}</span>
              {r.has ? (
                <span className="flex flex-none items-center gap-1 rounded-full bg-go/12 px-2 py-1 text-[10.5px] font-bold text-go"><Paperclip size={11} variant="Linear" color="currentColor" />Receipt</span>
              ) : (
                <button onClick={() => add(r.id)} className="flex flex-none items-center gap-1 rounded-full border border-teal/40 px-2.5 py-1 text-[10.5px] font-bold text-teal-2"><Camera size={12} variant="Linear" color="currentColor" />Add</button>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-4 text-center text-[10.5px] leading-relaxed text-faint">
          Snap a photo and Zeva reads the total, matches it to the transaction, and files it with the right category for your bookkeeper.
        </motion.div>
      </motion.div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-6">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-center text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}
