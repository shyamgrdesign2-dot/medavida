import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Check, Building2, Mail, Phone, User, Hash } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { InputField } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { ZevaMark } from "@/components/ZevaMark";
import { haptic } from "@/lib/haptics";

const CLINIC_TYPES = ["Functional medicine", "Compounding pharmacy", "Wellness clinic"];
const BUCKETS = [
  { id: "operating", label: "Operating", sub: "Day-to-day clinic spend" },
  { id: "payroll", label: "Payroll", sub: "Staff & doctor pay" },
  { id: "supplies", label: "Supplies & Inventory", sub: "Rx, labs, equipment" },
  { id: "tax", label: "Tax reserve", sub: "Set aside automatically" },
];

export function AccountCreate({ onDone, onSignin }: { onDone: () => void; onSignin: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Meridian Functional Health");
  const [ein, setEin] = useState("");
  const [ctype, setCtype] = useState(0);
  const [owner, setOwner] = useState("Dr. Alia Reyes");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [buckets, setBuckets] = useState<string[]>(["operating", "payroll", "supplies", "tax"]);
  const [done, setDone] = useState(false);

  const total = 4;
  const next = () => { haptic("tap"); if (step < 2) setStep(step + 1); else { haptic("success"); setDone(true); setTimeout(onDone, 1700); } };
  const back = () => { haptic("tap"); if (step > 0) setStep(step - 1); };
  const toggleBucket = (id: string) => { haptic("select"); setBuckets((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id])); };

  if (done) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <AnimatedBackground variant="waves" intensity={1} />
        <motion.div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 16 }}>
          <Check size={40} strokeWidth={3} />
        </motion.div>
        <motion.div className="relative mt-5 font-display text-[24px] font-semibold text-ink" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>Account ready</motion.div>
        <motion.div className="relative mt-1 text-[13px] text-dim" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>Setting up {name}…</motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <AnimatedBackground variant="waves" intensity={0.85} />

      {/* progress + header */}
      <div className="relative z-10 flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={step === 0 ? onSignin : back} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink">
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
              {i <= step && <motion.div className="h-full bg-teal" initial={{ width: 0 }} animate={{ width: "100%" }} />}
            </div>
          ))}
        </div>
        <ZevaMark size={20} tone="teal" />
      </div>

      {/* step content */}
      <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-6 pt-7">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-2">Step 1 of 3</div>
                  <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">Tell us about<br />your clinic</h1>
                </div>
                <InputField label="Clinic name" value={name} onChange={setName} prefix={<Building2 size={16} className="text-faint" strokeWidth={2} />} />
                <InputField label="EIN" value={ein} onChange={setEin} placeholder="12-3456789" prefix={<Hash size={16} className="text-faint" strokeWidth={2} />} hint="We verify this instantly, no docs needed." />
                <div>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Clinic type</div>
                  <div className="flex flex-wrap gap-2">
                    {CLINIC_TYPES.map((t, i) => (
                      <button key={t} onClick={() => { haptic("tap"); setCtype(i); }} className={"rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors " + (ctype === i ? "bg-teal text-on-teal" : "border border-border bg-surface text-dim")}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-2">Step 2 of 3</div>
                  <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">Who owns<br />the practice?</h1>
                </div>
                <InputField label="Full name" value={owner} onChange={setOwner} prefix={<User size={16} className="text-faint" strokeWidth={2} />} />
                <InputField label="Work email" value={email} onChange={setEmail} placeholder="you@clinic.com" type="email" prefix={<Mail size={16} className="text-faint" strokeWidth={2} />} />
                <InputField label="Phone" value={phone} onChange={setPhone} placeholder="(512) 555-0142" type="tel" prefix={<Phone size={16} className="text-faint" strokeWidth={2} />} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-2">Step 3 of 3</div>
                  <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink">Separate your<br />money by purpose</h1>
                  <p className="mt-2 text-[12.5px] text-dim">Each is a real account. Rent money never mixes with payroll.</p>
                </div>
                <div className="space-y-2">
                  {BUCKETS.map((b) => {
                    const on = buckets.includes(b.id);
                    return (
                      <button key={b.id} onClick={() => toggleBucket(b.id)} className={"flex w-full items-center gap-3 rounded-[10px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
                        <span className="flex-1">
                          <span className="block text-[13.5px] font-semibold text-ink">{b.label}</span>
                          <span className="block text-[11px] text-dim">{b.sub}</span>
                        </span>
                        <span className={"flex h-6 w-6 items-center justify-center rounded-full border " + (on ? "border-teal bg-teal text-on-teal" : "border-border")}>{on && <Check size={14} strokeWidth={3} />}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex-none px-6 pb-8 pt-3">
        <NeoPopButton onClick={next} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          {step < 2 ? "Continue" : "Create account"}
          <ChevronRight size={18} strokeWidth={2.2} />
        </NeoPopButton>
      </div>
    </div>
  );
}
