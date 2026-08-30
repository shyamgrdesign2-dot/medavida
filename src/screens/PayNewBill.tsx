import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader } from "lucide-react";
import { Flash, Drop, Wifi, Flashy, Call, TickCircle, ArrowRight2, type Icon as IconsaxIcon } from "iconsax-react";
import { BottomSheet } from "@/components/BottomSheet";
import { NeoPopButton } from "@/components/NeoPopButton";
import { InputField } from "@/components/ui";
import { CARDS, money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

interface Cat { id: string; label: string; icon: IconsaxIcon; billers: string[]; due: number }
export const CATEGORIES: Cat[] = [
  { id: "electricity", label: "Electricity", icon: Flash, billers: ["Austin Energy", "City of Austin Utilities", "CenterPoint Energy", "Oncor Electric"], due: 412.6 },
  { id: "water", label: "Water", icon: Drop, billers: ["Austin Water", "City of Austin Utilities"], due: 98.4 },
  { id: "internet", label: "Internet", icon: Wifi, billers: ["Google Fiber", "AT&T Fiber", "Spectrum Business"], due: 89.0 },
  { id: "gas", label: "Gas", icon: Flashy, billers: ["Texas Gas Service", "Atmos Energy"], due: 64.2 },
  { id: "phone", label: "Phone", icon: Call, billers: ["AT&T Business", "Verizon", "T-Mobile"], due: 220.0 },
];

type Step = "category" | "biller" | "account" | "fetching" | "review" | "done";

export function PayNewBill({ open, onClose, onPaid, startCategory }: { open: boolean; onClose: () => void; onPaid: (name: string, amt: number) => void; startCategory?: string }) {
  const seed = startCategory ? CATEGORIES.find((c) => c.id === startCategory) ?? null : null;
  const [step, setStep] = useState<Step>(seed ? "biller" : "category");
  const [cat, setCat] = useState<Cat | null>(seed);
  const [biller, setBiller] = useState("");
  const [acct, setAcct] = useState("");
  const [cardIdx, setCardIdx] = useState(0);

  const reset = () => { setStep(seed ? "biller" : "category"); setCat(seed); setBiller(""); setAcct(""); setCardIdx(0); };
  const close = () => { onClose(); setTimeout(reset, 300); };
  const fetchBill = () => {
    haptic("tap"); setStep("fetching");
    setTimeout(() => setStep("review"), 1100);
  };
  const pay = () => {
    haptic("success"); setStep("done");
    setTimeout(() => { onPaid(biller, cat?.due ?? 0); close(); }, 1500);
  };

  const title =
    step === "category" ? "Pay a new bill" :
    step === "biller" ? cat?.label :
    step === "account" ? biller :
    step === "review" ? "Confirm payment" : undefined;

  const back =
    step === "biller" ? () => setStep("category") :
    step === "account" ? () => setStep("biller") :
    step === "review" ? () => setStep("account") : undefined;

  return (
    <BottomSheet open={open} onClose={close} title={title} size="tall" onBack={step !== "done" && step !== "fetching" ? back : undefined}>
      <AnimatePresence mode="wait">
        {/* category grid */}
        {step === "category" && (
          <motion.div key="cat" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="grid grid-cols-3 gap-2.5">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { haptic("tap"); setCat(c); setStep("biller"); }} className="flex flex-col items-center gap-2 rounded-[10px] border border-border bg-surface-2 py-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/12 text-teal-2"><c.icon size={20} variant="Bulk" color="var(--color-teal-2)" /></span>
                <span className="text-[11.5px] font-semibold text-ink">{c.label}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* biller list */}
        {step === "biller" && cat && (
          <motion.div key="biller" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="rounded-[10px] border border-border bg-surface-2 px-3.5">
            {cat.billers.map((b, i) => (
              <button key={b} onClick={() => { haptic("tap"); setBiller(b); setStep("account"); }} className={"flex w-full items-center gap-3 py-3.5 text-left " + (i > 0 ? "border-t border-border-soft" : "")}>
                <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-surface text-teal-2"><cat.icon size={16} variant="Bulk" color="var(--color-teal-2)" /></span>
                <span className="flex-1 text-[13.5px] font-semibold text-ink">{b}</span>
                <ArrowRight2 size={16} variant="Linear" color="var(--color-faint)" />
              </button>
            ))}
          </motion.div>
        )}

        {/* account number */}
        {step === "account" && cat && (
          <motion.div key="acct" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="space-y-4">
            <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-surface-2 p-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[9px] bg-teal/12 text-teal-2"><cat.icon size={17} variant="Bulk" color="var(--color-teal-2)" /></span>
              <span className="text-[13px] font-semibold text-ink">{biller}</span>
            </div>
            <InputField label="Account / meter number" value={acct} onChange={setAcct} placeholder="e.g. 4471-88203" hint="We'll fetch your latest bill from the biller." />
            <NeoPopButton onClick={fetchBill} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">Fetch my bill <ArrowRight2 size={18} variant="Linear" color="currentColor" /></NeoPopButton>
          </motion.div>
        )}

        {/* fetching */}
        {step === "fetching" && (
          <motion.div key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-teal-2"><Loader size={30} strokeWidth={2.4} /></motion.div>
            <div className="mt-4 text-[13px] font-medium text-dim">Fetching your bill from {biller}…</div>
          </motion.div>
        )}

        {/* review + pay */}
        {step === "review" && cat && (
          <motion.div key="review" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
            <div className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-2 p-3.5">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[9px] bg-teal/12 text-teal-2"><cat.icon size={20} variant="Bulk" color="var(--color-teal-2)" /></span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold text-ink">{biller}</div>
                <div className="font-mono text-[11px] text-dim">Acct {acct || "4471-88203"} · due Sep 15</div>
              </div>
              <div className="tnum font-display text-[20px] font-semibold text-ink">{money(cat.due)}</div>
            </div>

            <div className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Pay from</div>
            <div className="flex flex-col gap-2">
              {CARDS.filter((c) => c.type !== "virtual").map((c, i) => {
                const on = cardIdx === i;
                return (
                  <button key={c.id} onClick={() => { haptic("tap"); setCardIdx(i); }} className={"flex items-center gap-3 rounded-[10px] border p-3 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface-2")}>
                    <span className="flex h-9 w-12 flex-none items-center justify-center rounded-md" style={{ background: c.variant === "credit" ? "linear-gradient(135deg,#0c211d,#05423a)" : "linear-gradient(135deg,#16201f,#08130f)", boxShadow: "inset 0 0 0 1px rgba(35,255,237,0.2)" }}>
                      <span className="font-mono text-[9px] font-bold text-teal-2">{c.last4}</span>
                    </span>
                    <span className="flex-1 text-[13px] font-semibold text-ink">{c.label}</span>
                    <span className={"flex h-5 w-5 items-center justify-center rounded-full border " + (on ? "border-teal bg-teal text-on-teal" : "border-border")}>{on && <TickCircle size={12} variant="Bulk" color="currentColor" />}</span>
                  </button>
                );
              })}
            </div>

            <NeoPopButton onClick={pay} className="mt-5 w-full" faceClassName="px-5 py-4 text-[15px] font-medium">Pay {money(cat.due)} <ArrowRight2 size={18} variant="Linear" color="currentColor" /></NeoPopButton>
          </motion.div>
        )}

        {/* success */}
        {step === "done" && cat && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6">
            <motion.div className="flex h-16 w-16 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}><TickCircle size={32} variant="Bulk" color="var(--color-go)" /></motion.div>
            <div className="mt-4 font-display text-[20px] font-semibold text-ink">Paid {money(cat.due)}</div>
            <div className="mt-1 text-[12.5px] text-dim">to {biller} · settled instantly</div>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  );
}
