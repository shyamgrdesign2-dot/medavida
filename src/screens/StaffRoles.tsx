import { useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { ChevronLeft, UserPlus, CreditCard, Check } from "lucide-react";
import { Chip, PatternAvatar } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { haptic } from "@/lib/haptics";

type RoleTone = "accent" | "neutral" | "pos" | "warn";
interface Member {
  name: string; initials: string; role: string; roleTone: RoleTone;
  can: string; card: string | null; you?: boolean;
}
const MEMBERS: Member[] = [
  { name: "Dr. Alia Reyes", initials: "AR", role: "Owner", roleTone: "accent", can: "Full access · collect, pay, approve, issue cards", card: "5528", you: true },
  { name: "Jon Alvarez", initials: "JA", role: "Office manager", roleTone: "neutral", can: "Approve & pay bills · collect payments", card: "4471" },
  { name: "Sara Kim", initials: "SK", role: "Front desk", roleTone: "pos", can: "Collect payments only · no card access", card: null },
  { name: "Priya Nair", initials: "PN", role: "Bookkeeper", roleTone: "warn", can: "View & export · no money movement", card: null },
];

const ROLES = [
  { role: "Owner", desc: "Everything, including issuing cards & inviting staff" },
  { role: "Office manager", desc: "Approve and send payments, collect, manage bills" },
  { role: "Front desk", desc: "Collect patient payments; cannot send money" },
  { role: "Bookkeeper", desc: "Read-only + accounting export; no payments" },
];

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 32 } } };

export function StaffRoles({ onBack }: { onBack: () => void }) {
  const [toast, setToast] = useState<string | null>(null);
  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">Team &amp; permissions</div>
          <div className="text-[11.5px] text-dim">{MEMBERS.length} members · role-based access</div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-4">
        {/* members */}
        <div className="space-y-3">
          {MEMBERS.map((m) => (
            <motion.button key={m.name} variants={item} onClick={() => haptic("tap")} className="flex w-full items-start gap-3 rounded-[14px] border border-border bg-surface p-4 text-left">
              <PatternAvatar size={42} label={m.initials} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[14px] font-semibold text-ink">{m.name}</span>
                  {m.you && <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-dim">You</span>}
                </span>
                <span className="mt-1 block"><Chip tone={m.roleTone}>{m.role}</Chip></span>
                <span className="mt-1.5 block text-[11.5px] leading-snug text-dim">{m.can}</span>
              </span>
              <span className="flex flex-none items-center gap-1 text-[10.5px] font-medium text-faint">
                {m.card ? <><CreditCard size={13} strokeWidth={2} className="text-teal-2" />···{m.card}</> : "No card"}
              </span>
            </motion.button>
          ))}
        </div>

        {/* role reference */}
        <motion.div variants={item} className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Roles</motion.div>
        <motion.div variants={item} className="rounded-[12px] border border-border bg-surface px-4">
          {ROLES.map((r, i) => (
            <div key={r.role} className={"flex items-start gap-2.5 py-3 " + (i > 0 ? "border-t border-border-soft" : "")}>
              <Check size={15} strokeWidth={2.6} className="mt-0.5 flex-none text-teal-2" />
              <span>
                <span className="block text-[13px] font-semibold text-ink">{r.role}</span>
                <span className="block text-[11.5px] text-dim">{r.desc}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex-none px-5 pb-8 pt-2">
        <NeoPopButton onClick={() => { haptic("success"); setToast("Invite link copied — share with your team"); setTimeout(() => setToast(null), 1900); }} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          <UserPlus size={17} strokeWidth={2.4} /> Invite a team member
        </NeoPopButton>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-center text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}
