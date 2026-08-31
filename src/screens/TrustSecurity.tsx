import { motion, type Variants } from "motion/react";
import { Explainer } from "@/components/ui";
import { ArrowLeft2, Bank, ShieldTick, Lock1, Health, Scan , InfoCircle} from "iconsax-react";
import { haptic } from "@/lib/haptics";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

const SECTIONS = [
  { icon: Bank, title: "FDIC-insured deposits", body: "Zeva is a financial technology company, not a bank. Banking services are provided by Anchor Trust Bank, N.A., Member FDIC. Your clinic's balances are held at the sponsor bank and eligible for pass-through FDIC insurance up to $250,000." },
  { icon: Lock1, title: "Card & payment security", body: "Patient cards on file are tokenized and stored to PCI-DSS Level 1 standards — Zeva never holds raw card numbers. All traffic is protected with 256-bit TLS encryption, at rest and in transit." },
  { icon: Health, title: "HIPAA-aligned handling", body: "Because payment memos reference patient IDs and medications, protected health information is encrypted, access-logged, and handled under a Business Associate Agreement (BAA) available to your practice." },
  { icon: Scan, title: "Fraud & access controls", body: "Real-time fraud monitoring auto-freezes a card on suspicious activity. Face ID / PIN unlock, per-user roles, and payment approvals keep every dollar under sign-off." },
];

const BADGES = ["Member FDIC", "PCI-DSS L1", "HIPAA / BAA", "SOC 2 Type II"];

export function TrustSecurity({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div className="font-display text-[18px] font-semibold text-ink">Security &amp; protection</div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-10 pt-4">
        {/* what this is — plain-language explainer */}
        <motion.div variants={item}>
          <Explainer title="How Zeva keeps you safe">Your funds sit in FDIC-insured partner banks, card data is encrypted, and access is locked behind biometrics. Here's the protection working behind every payment.</Explainer>
        </motion.div>

        {/* hero */}
        <motion.div variants={item} className="relative overflow-hidden rounded-[16px] border border-teal/25 bg-teal/8 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-teal/15 text-teal-2"><ShieldTick size={24} variant="Bulk" color="currentColor" /></span>
            <div>
              <div className="font-display text-[16px] font-semibold text-ink">Your money is protected</div>
              <div className="text-[12px] text-dim">Bank-grade, healthcare-ready</div>
            </div>
          </div>
        </motion.div>

        {/* trust badges */}
        <motion.div variants={item} className="mt-3 flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span key={b} className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold text-dim">{b}</span>
          ))}
        </motion.div>

        {/* sections */}
        <div className="mt-4 space-y-3">
          {SECTIONS.map((s) => (
            <motion.div key={s.title} variants={item} className="rounded-[14px] border border-border bg-surface p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-surface-2 text-teal-2"><s.icon size={18} variant="Bulk" color="currentColor" /></span>
                <div className="text-[14px] font-semibold text-ink">{s.title}</div>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-dim">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="mt-4 text-center text-[10.5px] leading-relaxed text-faint">
          Deposits held at Anchor Trust Bank, N.A., Member FDIC. Zeva is a technology company and not a bank. Card issuance and processing by Zeva Pay. This is a prototype for demonstration.
        </motion.div>
      </motion.div>
    </div>
  );
}
