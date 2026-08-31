import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowLeft2, TickCircle, Danger, Send2, DocumentText, CalendarTick, InfoCircle } from "iconsax-react";
import { Chip } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

interface Vendor { id: string; name: string; cat: string; ytd: number; w9: boolean; eligible: boolean }
const INITIAL: Vendor[] = [
  { id: "malik", name: "Dr. Sana Malik", cat: "Per-diem NP", ytd: 28400, w9: true, eligible: true },
  { id: "coach", name: "Priya Coaching LLC", cat: "Health coaching", ytd: 14200, w9: true, eligible: true },
  { id: "labs", name: "Cornerstone Labs Consulting", cat: "Consulting", ytd: 9600, w9: true, eligible: true },
  { id: "clean", name: "CleanCo Services", cat: "Facilities", ytd: 4800, w9: false, eligible: true },
  { id: "media", name: "Bright Media", cat: "Marketing", ytd: 520, w9: false, eligible: false },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function Vendors1099({ onBack }: { onBack: () => void }) {
  const [vendors, setVendors] = useState(INITIAL);
  const [toast, setToast] = useState<string | null>(null);

  const eligible = vendors.filter((v) => v.eligible);
  const reportable = eligible.reduce((s, v) => s + v.ytd, 0);
  const missingW9 = eligible.filter((v) => !v.w9);

  const ping = (m: string) => { haptic("success"); setToast(m); setTimeout(() => setToast(null), 1900); };
  const requestW9 = (id: string) => {
    const v = vendors.find((x) => x.id === id);
    setVendors((vs) => vs.map((x) => (x.id === id ? { ...x, w9: true } : x)));
    ping(`W-9 request sent to ${v?.name}`);
  };

  const statusChip = (v: Vendor) =>
    !v.eligible ? <Chip tone="neutral">Under $600</Chip> :
    v.w9 ? <Chip tone="pos"><TickCircle size={10} variant="Bulk" color="currentColor" />Ready</Chip> :
    <Chip tone="neg">W-9 needed</Chip>;

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">1099 &amp; vendors</div>
          <div className="text-[11.5px] text-dim">Contractor payments for tax time</div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {/* what this is — plain-language explainer */}
        <motion.div variants={item} className="mb-4 flex gap-3 rounded-[14px] border border-teal/25 bg-teal/8 p-3.5">
          <InfoCircle size={20} variant="Bulk" color="var(--color-teal-2)" className="mt-0.5 flex-none" />
          <div>
            <div className="text-[12.5px] font-semibold text-ink">What is 1099 &amp; vendors?</div>
            <div className="mt-0.5 text-[11.5px] leading-snug text-dim">The IRS needs a 1099-NEC for every contractor you pay $600+ in a year. Zeva tallies each vendor's payments, flags who crosses the threshold, collects their W-9, and pre-fills the forms — so tax time is a click, not a scramble.</div>
          </div>
        </motion.div>

        {/* year summary */}
        <motion.div variants={item} className="card-lift rounded-[16px] border border-border bg-surface p-4">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-faint">Tax year 2026 · reportable</div>
          <div className="tnum mt-1 font-display text-[28px] font-semibold text-ink">{money(reportable)}</div>
          <div className="mt-1 text-[11.5px] text-dim">{eligible.length} vendors need a 1099-NEC</div>
          <div className="mt-3 flex items-center gap-2 rounded-[9px] bg-surface-2 px-3 py-2 text-[11.5px] text-dim">
            <CalendarTick size={14} variant="Linear" color="var(--color-teal-2)" className="flex-none" /> 1099-NEC due to contractors &amp; IRS by <span className="font-semibold text-ink">Jan 31, 2027</span>
          </div>
        </motion.div>

        {/* missing W-9 alert */}
        {missingW9.length > 0 && (
          <motion.div variants={item} className="mt-3 flex items-center gap-3 rounded-[14px] border border-caution/30 bg-caution/8 p-3.5">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-caution/15 text-caution"><Danger size={18} variant="Bulk" color="currentColor" /></span>
            <span className="flex-1">
              <span className="block text-[13px] font-semibold text-ink">{missingW9.length} W-9 missing</span>
              <span className="block text-[11.5px] text-dim">Collect before filing to avoid backup withholding</span>
            </span>
          </motion.div>
        )}

        {/* vendors */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Contractors paid this year</motion.div>
        <motion.div variants={item} className="card-lift rounded-[12px] border border-border bg-surface px-4">
          {vendors.map((v, i) => (
            <div key={v.id} className={"py-3 " + (i > 0 ? "border-t border-border-soft" : "")}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] bg-surface-2 text-ink"><DocumentText size={17} variant="Linear" color="currentColor" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">{v.name}</span>
                  <span className="block truncate text-[11.5px] text-dim">{v.cat} · {money0(v.ytd)} paid</span>
                </span>
                {statusChip(v)}
              </div>
              {v.eligible && !v.w9 && (
                <button onClick={() => requestW9(v.id)} className="sec-btn mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-teal/40 py-2.5 text-[12px] font-semibold text-teal-2">
                  <Send2 size={13} variant="Linear" color="currentColor" /> Request W-9
                </button>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-4 text-center text-[10.5px] leading-relaxed text-faint">
          Zeva tallies every contractor payment, flags who crosses the $600 threshold, stores their W-9, and pre-fills 1099-NEC forms for e-filing.
        </motion.div>
      </motion.div>

      <div className="flex-none px-5 pb-8 pt-2">
        <NeoPopButton onClick={() => ping(`${eligible.length} 1099-NEC forms prepared`)} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          <DocumentText size={17} variant="Linear" color="currentColor" /> Prepare 1099-NEC filing
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
