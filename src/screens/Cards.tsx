import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight2, TickCircle } from "iconsax-react";
import {
  Lock1, Eye, Shop, Speedometer, Add, CloudSnow, ReceiptText, WalletAdd,
  Danger, RefreshCircle, MessageQuestion, Headphone, TrendUp, DocumentText, Setting2,
  type Icon as IconsaxIcon,
} from "iconsax-react";
import { ZevaCard } from "@/components/ZevaCard";
import { Toggle, ControlRow, Chip, SectionTitle, InputField } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { BottomSheet } from "@/components/BottomSheet";
import { CARDS, money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const CARD_W = 300;
const GAP = 16;

const LIMITS: Record<string, { label: string; used: number; total: number } | null> = {
  operating: null,
  credit: { label: "Credit used", used: 8000, total: 50000 },
};
const MERCHANTS: Record<string, string[]> = { operating: [], credit: [] };

// recent statements per card (prototype)
const STATEMENTS = [
  { period: "August 2026", amount: 18240.5, status: "Current" },
  { period: "July 2026", amount: 21980.0, status: "Paid" },
  { period: "June 2026", amount: 17410.75, status: "Paid" },
];

type Sheet = "issue" | "statements" | "dispute" | "help" | null;

export function Cards({ onIssue }: { onIssue?: () => void }) {
  const [active, setActive] = useState(0);
  const [frozen, setFrozen] = useState<Record<string, boolean>>({});
  const [sheet, setSheet] = useState<Sheet>(null);
  const [issueName, setIssueName] = useState("");
  const [issued, setIssued] = useState(false);
  const [autoFreeze, setAutoFreeze] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { haptic("success"); setToast(m); setTimeout(() => setToast(null), 1800); };
  const scroller = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (CARD_W + GAP));
    if (i !== active) { setActive(i); haptic("tap"); }
  };

  const card = CARDS[active];
  const limit = LIMITS[card.id];
  const merchants = MERCHANTS[card.id] ?? [];
  const isFrozen = !!frozen[card.id];
  const isCredit = card.type === "credit";
  const toggleFreeze = () => { haptic(isFrozen ? "tap" : "success"); setFrozen((f) => ({ ...f, [card.id]: !isFrozen })); };

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-28">
      {/* header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <div className="font-display text-[22px] font-semibold tracking-tight text-ink">Cards</div>
          <div className="text-[12px] text-dim">{CARDS.length} active</div>
        </div>
        <NeoPopButton depth={4} faceClassName="px-3.5 py-2.5 text-[12.5px] font-semibold" onClick={() => { haptic("tap"); setIssued(false); setSheet("issue"); onIssue?.(); }}>
          <Add size={17} variant="Linear" color="currentColor" /> Issue
        </NeoPopButton>
      </div>

      {/* card carousel */}
      <div ref={scroller} onScroll={onScroll} className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2" style={{ scrollPaddingLeft: 20 }}>
        {CARDS.map((c, i) => (
          <div key={c.id} className="shrink-0 snap-start" style={{ width: CARD_W }}>
            <motion.div animate={{ opacity: i === active ? 1 : 0.55, scale: i === active ? 1 : 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 32 }}>
              <ZevaCard card={c} interactive={i === active} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* dots + status */}
      <div className="mt-1 flex justify-center gap-1.5">
        {CARDS.map((c, i) => (
          <span key={c.id} className="h-1.5 rounded-full transition-all" style={{ width: i === active ? 16 : 6, background: i === active ? "var(--color-teal)" : "var(--color-surface-3)" }} />
        ))}
      </div>
      {/* quick-action row (research: actions directly under the card) */}
      <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
        <CardAction icon={CloudSnow} label={isFrozen ? "Unfreeze" : "Freeze"} active={isFrozen} onClick={toggleFreeze} />
        <CardAction icon={ReceiptText} label="Statements" onClick={() => { haptic("tap"); setSheet("statements"); }} />
        <CardAction icon={WalletAdd} label="Add to Pay" onClick={() => flash("Added to Apple Wallet")} />
        <CardAction icon={Danger} label="Dispute" onClick={() => { haptic("tap"); setSheet("dispute"); }} />
      </div>

      {/* spending limit / credit usage */}
      {limit && (
        <div className="mx-5 mt-4 rounded-[12px] border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-dim"><Speedometer size={15} variant="Linear" color="var(--color-dim)" />{limit.label}</div>
            <div className="tnum text-[12.5px] font-bold text-ink">{money(limit.used)} <span className="text-faint">/ {money(limit.total)}</span></div>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.div className="h-full rounded-full bg-teal" initial={{ width: 0 }} animate={{ width: `${(limit.used / limit.total) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          </div>
          {isCredit && (
            <div className="mt-3 flex items-center gap-2 rounded-[9px] bg-teal/8 px-3 py-2">
              <TrendUp size={16} variant="Bulk" color="var(--color-teal-2)" />
              <span className="text-[11.5px] text-dim"><span className="font-semibold text-ink">$624 cash back</span> this cycle · 1.5% on all spend</span>
            </div>
          )}
        </div>
      )}

      {merchants.length > 0 && (
        <div className="mx-5 mt-3 rounded-[12px] border border-border bg-surface p-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-dim"><Shop size={15} variant="Linear" color="var(--color-dim)" />Locked to approved vendors</div>
          <div className="flex flex-wrap gap-2">{merchants.map((m) => <Chip key={m} tone="accent">{m}</Chip>)}</div>
        </div>
      )}

      {/* card controls */}
      <SectionTitle>Card controls</SectionTitle>
      <div className="mx-5 -mt-1 rounded-[12px] border border-border bg-surface px-4">
        <ControlRow title="Show card number" sub={`•••• •••• •••• ${card.last4}`} onClick={() => haptic("tap")} trailing={<Eye size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Card PIN" sub="Change your 4-digit PIN" onClick={() => haptic("tap")} trailing={<Lock1 size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Spend controls" sub="Limits, merchant & category rules" onClick={() => haptic("tap")} trailing={<Setting2 size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Freeze on suspicious activity" sub="Auto-freeze if fraud detected" trailing={<Toggle on={autoFreeze} onChange={setAutoFreeze} />} />
      </div>

      {/* statements & support */}
      <SectionTitle>Statements &amp; support</SectionTitle>
      <div className="mx-5 -mt-1 rounded-[12px] border border-border bg-surface px-4">
        <ControlRow title="Statements" sub="Monthly PDF & CSV" onClick={() => { haptic("tap"); setSheet("statements"); }} trailing={<DocumentText size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Dispute a charge" sub="Flag a transaction for review" onClick={() => { haptic("tap"); setSheet("dispute"); }} trailing={<Danger size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Report lost / replace" sub="Freeze & ship a new card" onClick={() => haptic("tap")} trailing={<RefreshCircle size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Help & FAQ" sub="Common questions about your card" onClick={() => { haptic("tap"); setSheet("help"); }} trailing={<MessageQuestion size={18} variant="Linear" color="var(--color-dim)" />} />
        <div className="border-t border-border-soft" />
        <ControlRow title="Contact support" sub="Chat with the Zeva team · 24/7" onClick={() => haptic("tap")} trailing={<Headphone size={18} variant="Linear" color="var(--color-dim)" />} />
      </div>

      {/* ---- sheets ---- */}
      <BottomSheet open={sheet === "issue"} onClose={() => setSheet(null)} title={issued ? undefined : "Issue a virtual card"}>
        {issued ? (
          <div className="flex flex-col items-center py-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-go/15"><TickCircle size={34} variant="Bulk" color="var(--color-go)" /></span>
            <div className="mt-4 font-display text-[20px] font-semibold text-ink">Card issued</div>
            <div className="mt-1 text-[12.5px] text-dim">Ready to use instantly · •••• 6120</div>
          </div>
        ) : (
          <div className="space-y-3.5">
            <InputField label="Card label" value={issueName} onChange={setIssueName} placeholder="e.g. Front desk supplies" />
            <div>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-dim">Restrict to vendors</div>
              <div className="flex flex-wrap gap-2">
                {["Fullscript", "Rupa Health", "McKesson", "Any vendor"].map((m, i) => (
                  <Chip key={m} tone={i < 3 ? "accent" : "neutral"}>{m}</Chip>
                ))}
              </div>
            </div>
            <NeoPopButton onClick={() => { haptic("success"); setIssued(true); }} className="mt-2 w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
              Issue card <ArrowRight2 size={18} variant="Linear" color="currentColor" />
            </NeoPopButton>
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={sheet === "statements"} onClose={() => setSheet(null)} title="Statements">
        <div className="flex flex-col gap-2">
          {STATEMENTS.map((s) => (
            <button key={s.period} onClick={() => haptic("tap")} className="flex items-center gap-3 rounded-[11px] border border-border bg-surface-2 p-3.5 text-left">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[9px] bg-surface"><DocumentText size={19} variant="Bulk" color="var(--color-teal-2)" /></span>
              <span className="flex-1">
                <span className="block text-[13.5px] font-semibold text-ink">{s.period}</span>
                <span className="tnum block text-[11.5px] text-dim">{money(s.amount)}</span>
              </span>
              <Chip tone={s.status === "Paid" ? "pos" : "warn"}>{s.status}</Chip>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "dispute"} onClose={() => setSheet(null)} title="Dispute a charge">
        <div className="space-y-3.5">
          <p className="text-[12.5px] leading-relaxed text-dim">Pick the transaction you don't recognize. We'll freeze the charge, open a case, and email you a reference within minutes.</p>
          {[{ m: "McKesson Medical", a: 3850, d: "Aug 24" }, { m: "Fullscript", a: 1240.5, d: "Yesterday" }].map((t) => (
            <button key={t.m} onClick={() => haptic("tap")} className="flex w-full items-center gap-3 rounded-[11px] border border-border bg-surface-2 p-3.5 text-left">
              <span className="flex-1">
                <span className="block text-[13.5px] font-semibold text-ink">{t.m}</span>
                <span className="block text-[11.5px] text-dim">{t.d}</span>
              </span>
              <span className="tnum text-[13.5px] font-bold text-ink">{money(t.a)}</span>
              <ArrowRight2 size={16} variant="Linear" color="var(--color-faint)" />
            </button>
          ))}
          <div className="rounded-[10px] bg-surface-2 px-3.5 py-3 text-[11.5px] text-faint">Most disputes are resolved in 3–5 business days. Provisional credit may apply.</div>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "help"} onClose={() => setSheet(null)} title="Help & FAQ">
        <div className="flex flex-col gap-2">
          {[
            { q: "When does my statement generate?", a: "On the 1st of each month for the prior cycle." },
            { q: "How fast is a virtual card ready?", a: "Instantly — issued cards work the moment they appear." },
            { q: "What happens when I freeze a card?", a: "New spend is blocked immediately; recurring and pending charges may still settle." },
            { q: "How does cash back work?", a: "Earn 1.5% back on all card spend, applied automatically as a statement credit each cycle." },
          ].map((f) => (
            <div key={f.q} className="rounded-[11px] border border-border bg-surface-2 p-3.5">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ink"><MessageQuestion size={16} variant="Bulk" color="var(--color-teal-2)" />{f.q}</div>
              <div className="mt-1 pl-[23px] text-[12px] leading-relaxed text-dim">{f.a}</div>
            </div>
          ))}
          <button onClick={() => haptic("tap")} className="mt-1 flex items-center justify-center gap-1.5 rounded-[11px] bg-teal/10 py-3 text-[12.5px] font-semibold text-teal-2">
            <Headphone size={16} variant="Bulk" color="currentColor" /> Still stuck? Chat with support
          </button>
        </div>
      </BottomSheet>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="rounded-full border border-border bg-surface px-4 py-2.5 text-[12.5px] font-semibold text-ink" style={{ boxShadow: "var(--shadow-card)" }}>{toast}</div>
        </motion.div>
      )}
    </div>
  );
}

function CardAction({ icon: Icon, label, onClick, active }: { icon: IconsaxIcon; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span
        className="flex h-[54px] w-full items-center justify-center rounded-[15px]"
        style={
          active
            ? { background: "var(--grad-teal)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), var(--shadow-card)" }
            : {
                background: "linear-gradient(160deg, var(--glass-hi), transparent 46%), var(--glass-bg)",
                backdropFilter: "blur(14px) saturate(1.3)",
                WebkitBackdropFilter: "blur(14px) saturate(1.3)",
                boxShadow: "inset 0 1px 0 var(--glass-hi), inset 0 0 0 1px var(--glass-brd), var(--shadow-card)",
              }
        }
      >
        <Icon size={21} variant="Bulk" color={active ? "var(--color-on-teal)" : "var(--color-teal-2)"} />
      </span>
      <span className="text-[10.5px] font-medium text-dim">{label}</span>
    </motion.button>
  );
}
