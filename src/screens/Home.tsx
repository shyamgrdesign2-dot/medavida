import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, type Variants } from "motion/react";
import { Notification, ArrowUp2, Verify } from "iconsax-react";
import { Send2, Receipt2, Cards as CardsIcon, MoneyRecive, Flash, Calendar, Chart2, type Icon as IconsaxIcon } from "iconsax-react";
import { Injection } from "@/components/glyphs";
import { CardWallet } from "@/components/CardWallet";
import { Squircle } from "@/lib/squircle";
import { QuickAction, SectionTitle, TxnRow, Chip, PatternAvatar } from "@/components/ui";
import { CLINIC, TXNS, money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 34 } } };

// real product signals — clean gradient-tint cards, each opens a destination
const HIGHLIGHTS: { icon: IconsaxIcon; tint: string; title: string; sub: string; go: string }[] = [
  { icon: Flash, tint: "var(--acc-green)", title: "Instant payout", sub: "128 settled today", go: "settlement" },
  { icon: Injection as unknown as IconsaxIcon, tint: "var(--acc-teal)", title: "GLP-1 +14%", sub: "74 members", go: "memberships" },
  { icon: Calendar, tint: "var(--acc-amber)", title: "Rent · $6,200", sub: "Due Sep 1", go: "bills" },
  { icon: Chart2, tint: "var(--acc-blue)", title: "Net +$11,628", sub: "This month", go: "insights" },
];

/** Clean gradient-tint highlight card (no coupon notches). */
function Highlight({ icon: Icon, tint, title, sub, onClick }: { icon: IconsaxIcon; tint: string; title: string; sub: string; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => { haptic("tap"); onClick?.(); }}
      className="flex w-[172px] flex-none items-center gap-3 rounded-[14px] p-3 text-left"
      style={{
        background: `linear-gradient(150deg, color-mix(in oklab, ${tint} 16%, var(--color-surface-2)) 0%, var(--color-surface-2) 66%)`,
        border: "1px solid var(--glass-brd)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[11px]" style={{ background: `color-mix(in oklab, ${tint} 24%, transparent)` }}><Icon size={18} variant="Bulk" color={tint} /></span>
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-bold text-ink">{title}</span>
        <span className="block truncate text-[10.5px] text-dim">{sub}</span>
      </span>
    </motion.button>
  );
}

export function Home({ onOpenTxn, onQuick, onSeeAll }: { onOpenTxn?: (id: string) => void; onQuick?: (k: string) => void; onSeeAll?: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [lifted, setLifted] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setLifted(v > 24));

  return (
    <div ref={scrollRef} className="no-scrollbar relative h-full overflow-y-auto overflow-x-hidden">
      {/* HEADER — greeting left, notifications + profile at the far right */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-20 px-5 pb-6 pt-4">
        <motion.div variants={item} className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-faint">Good morning</div>
            <div className="flex items-center gap-1.5">
              <span className="truncate font-display text-[19px] font-semibold leading-tight text-ink">{CLINIC.owner}</span>
              <span className="flex-none"><Verify size={15} variant="Bulk" color="var(--color-teal-2)" /></span>
            </div>
          </div>
          <button onClick={() => { haptic("tap"); onQuick?.("approvals"); }} aria-label="Notifications" className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-surface text-ink">
            <Notification size={17} variant="Linear" color="currentColor" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[9px] font-bold text-on-teal">3</span>
          </button>
          <button onClick={() => { haptic("tap"); onQuick?.("more"); }} aria-label="Account" className="flex-none">
            <PatternAvatar seed={CLINIC.name} size={40} label="SG" />
          </button>
        </motion.div>
      </motion.div>

      {/* CARD SHOWCASE — hero, pinned; double-tap opens Cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="sticky top-0 z-0 px-5">
        <motion.div variants={item} className="relative">
          {/* soft brand-blue glow that blooms behind the card */}
          <div className="pointer-events-none absolute -inset-x-3 -bottom-8 top-8 -z-10" style={{ background: "radial-gradient(58% 60% at 50% 62%, var(--card-glow), transparent 72%)", filter: "blur(26px)" }} />
          <CardWallet width={346} onCardTap={() => onQuick?.("cards")} />
        </motion.div>
      </motion.div>

      {/* PANEL — clean sheet (no wash); the animated background lives behind the card above */}
      <div className="relative z-10 mt-5 min-h-[82%] rounded-t-[22px] border-t border-border bg-surface" style={{ boxShadow: "0 -14px 34px -22px rgba(0,0,0,0.5)" }}>
        <div className="relative flex justify-center pt-2.5">
          <motion.div className="text-faint" animate={{ rotate: lifted ? 180 : 0, y: lifted ? 0 : [0, -2.5, 0] }} transition={{ rotate: { type: "spring", stiffness: 300, damping: 30 }, y: { duration: 1.6, repeat: lifted ? 0 : Infinity, ease: "easeInOut" } }}>
            <ArrowUp2 size={16} variant="Linear" color="currentColor" />
          </motion.div>
        </div>

        <div className="px-5 pb-28 pt-1">
          {/* liquid-glass quick actions — top; Collect (patient inflow) leads */}
          <div className="grid grid-cols-4 gap-2.5">
            <QuickAction icon={MoneyRecive} label="Collect" onClick={() => onQuick?.("collect")} />
            <QuickAction icon={Send2} label="Send" onClick={() => onQuick?.("send")} />
            <QuickAction icon={Receipt2} label="Bill Pay" onClick={() => onQuick?.("bills")} />
            <QuickAction icon={CardsIcon} label="Cards" onClick={() => onQuick?.("cards")} />
          </div>

          {/* highlights — below the actions */}
          <div className="no-scrollbar -mx-5 mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1">
            {HIGHLIGHTS.map((h) => <Highlight key={h.title} icon={h.icon} tint={h.tint} title={h.title} sub={h.sub} onClick={() => onQuick?.(h.go)} />)}
          </div>

          {/* recent activity */}
          <SectionTitle action={<button onClick={onSeeAll} className="text-[11px] font-semibold text-teal-2">See all</button>}>Recent activity</SectionTitle>
          <Squircle radius={12} className="card-lift border border-border bg-surface-2 px-3.5">
            {TXNS.slice(0, 8).map((t, i) => (
              <div key={t.id} className={i > 0 ? "border-t border-border-soft" : ""}>
                <TxnRow
                  category={t.category}
                  title={t.title}
                  sub={t.sub}
                  amount={money(t.amount)}
                  dir={t.dir}
                  onClick={() => onOpenTxn?.(t.id)}
                  chip={
                    t.status === "instant" ? <Chip tone="pos">Instant</Chip> :
                    t.status === "approval" ? <Chip tone="warn">Needs approval</Chip> :
                    undefined
                  }
                />
              </div>
            ))}
          </Squircle>
        </div>
      </div>
    </div>
  );
}
