import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform, useReducedMotion } from "motion/react";
import { ChevronRight, Zap, Check, ArrowDownLeft, ArrowUpRight, Building2, Wifi } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ZevaMark } from "@/components/ZevaMark";
import { ZevaCard } from "@/components/ZevaCard";
import { NeoPopButton } from "@/components/NeoPopButton";
import { CARDS } from "@/lib/data";
import { APP_NAME } from "@/lib/brand";

const SLIDE_MS = 4600;

interface Slide {
  key: string;
  eyebrow: string;
  lines: string[];
  body: string;
  hero: React.ReactNode;
}

/** Masked, word-by-word upward reveal — a punchier title animation. */
function TitleReveal({ lines, k }: { lines: string[]; k: string }) {
  let idx = 0;
  return (
    <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.12] tracking-tight text-ink">
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden py-[1px]">
          {line.split(" ").map((w) => {
            const d = 0.12 + idx++ * 0.055;
            return (
              <span key={w + idx} className="inline-block overflow-hidden align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: d, type: "spring", stiffness: 320, damping: 36 }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/* ------------------------------ slide heroes ------------------------------ */

function FlowPill({ text, tone, delay, from, to }: { text: string; tone: "in" | "out"; delay: number; from: number; to: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={
        "tnum absolute left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[12px] font-semibold " +
        (tone === "in" ? "bg-go/15 text-go" : "bg-surface-3 text-dim")
      }
      style={{ top: "50%", marginTop: -12 }}
      initial={{ y: from, opacity: 0 }}
      animate={reduce ? { opacity: 0.9, y: (from + to) / 2 } : { y: [from, to], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {text}
    </motion.span>
  );
}

function HeroFlow() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* bounded stage so nothing overflows */}
      <div className="relative flex h-[236px] w-[250px] items-center justify-center overflow-hidden">
        {/* inflow (falls into the balance) */}
        <div className="absolute inset-x-0 top-3 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-go/12 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.1em] text-go">
            <ArrowDownLeft size={12} strokeWidth={2.6} /> Money in
          </span>
        </div>
        <FlowPill text="+$340" tone="in" delay={0} from={-86} to={-8} />
        <FlowPill text="+$499" tone="in" delay={0.9} from={-86} to={-8} />
        <FlowPill text="+$285" tone="in" delay={1.8} from={-86} to={-8} />

        {/* central balance */}
        <motion.div
          className="teal-glow relative z-10 rounded-2xl border border-border bg-surface/85 px-5 py-3 backdrop-blur-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">Operating balance</div>
          <div className="tnum font-display text-[26px] font-semibold text-ink">$128,450</div>
        </motion.div>

        {/* outflow (descends away from the balance) */}
        <FlowPill text="−$1,240" tone="out" delay={0.45} from={8} to={86} />
        <FlowPill text="−$6,200" tone="out" delay={1.35} from={8} to={86} />
        <FlowPill text="−$412" tone="out" delay={2.25} from={8} to={86} />
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.1em] text-dim">
            Money out <ArrowUpRight size={12} strokeWidth={2.6} />
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroInstant() {
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => `+$${Math.round(n).toLocaleString("en-US")}`);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const c = animate(v, 340, { duration: 1.1, ease: "easeOut", delay: 0.5 });
    const t = setTimeout(() => setSettled(true), 1.75 * 1000);
    return () => { c.stop(); clearTimeout(t); };
  }, [v]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      {/* cause: a patient taps their card */}
      <motion.div
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 backdrop-blur-md"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal/20 text-[9px]">💳</span>
        <span className="text-[11px] font-medium text-dim">Patient MFH-2831 tapped •• 4821</span>
      </motion.div>

      {/* effect: it lands, counting up */}
      <motion.div
        className="tnum font-display text-[46px] font-semibold"
        style={{ color: settled ? "var(--color-go)" : "var(--color-ink)" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 }}
      >
        <motion.span>{text}</motion.span>
      </motion.div>

      {/* payoff: settled instantly */}
      <div className="h-6">
        <AnimatePresence>
          {settled && (
            <motion.div
              className="inline-flex items-center gap-1.5 rounded-full bg-go/15 px-3 py-1 text-[11px] font-bold text-go"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <Check size={13} strokeWidth={3} /> Settled to Operating · instantly
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-1 w-[240px] space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-teal-2"><ZevaMark size={13} tone="teal" />{APP_NAME}</span>
            <span className="flex items-center gap-1 text-go"><Check size={13} strokeWidth={3} />Instant</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.div className="h-full rounded-full bg-teal" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-faint">
            <span>Traditional bank</span>
            <span>2–3 days</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.div className="h-full rounded-full bg-faint/50" initial={{ width: 0 }} animate={{ width: "34%" }} transition={{ duration: 2.4, delay: 0.6, ease: "linear" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* soft teal glow behind the card — no frame, no stroke */}
      <motion.div
        className="pointer-events-none absolute h-[220px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(35,255,237,0.16), transparent 65%)", filter: "blur(20px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="relative w-[250px]"
        initial={{ rotateZ: -7, y: 20, opacity: 0 }}
        animate={{ rotateZ: -3, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
      >
        <ZevaCard card={CARDS[0]} />
      </motion.div>
    </div>
  );
}

const BILLS = [
  { icon: Building2, name: "Downtown Wellness Suite", sub: "Rent · Suite 4B", amt: "$6,200", chip: "Upcoming", tone: "warn" as const, pulse: false },
  { icon: Zap, name: "City of Austin", sub: "Electricity · autopay", amt: "$412", chip: "Autopay on", tone: "pos" as const, pulse: true },
  { icon: Wifi, name: "Google Fiber", sub: "Internet · biz 1-gig", amt: "$89", chip: "Scheduled", tone: "neutral" as const, pulse: false },
];
const CHIP: Record<string, string> = {
  warn: "bg-caution/15 text-caution",
  pos: "bg-go/15 text-go",
  neutral: "bg-surface-3 text-dim",
};
const ICONWRAP: Record<string, string> = {
  warn: "bg-caution/12 text-caution",
  pos: "bg-go/12 text-go",
  neutral: "bg-surface-3 text-dim",
};

function HeroBills() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="w-[264px] border border-border bg-surface/80 p-4 backdrop-blur-md"
        style={{ borderRadius: 18 }}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        <div className="mb-3 flex items-end justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">This cycle</div>
          <div className="tnum text-[13px] font-bold text-ink">$6,701 due</div>
        </div>
        <div className="flex flex-col gap-1">
          {BILLS.map((b, i) => (
            <motion.div
              key={b.name}
              className="flex items-center gap-2.5 py-2"
              initial={{ x: 18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 26 }}
            >
              <div className={"flex h-8 w-8 flex-none items-center justify-center rounded-[9px] " + ICONWRAP[b.tone]}>
                <b.icon size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-ink">{b.name}</div>
                <div className="text-[10px] text-dim">{b.sub}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="tnum text-[12.5px] font-bold text-ink">{b.amt}</div>
                <span className={"inline-flex items-center gap-1 rounded-full px-1.5 py-[2px] text-[8.5px] font-bold uppercase tracking-wide " + CHIP[b.tone]}>
                  {b.pulse && (
                    <span className="relative flex h-1.5 w-1.5">
                      <motion.span className="absolute inline-flex h-full w-full rounded-full bg-go" animate={{ scale: [1, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-go" />
                    </span>
                  )}
                  {b.chip}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------ slides ------------------------------ */

const SLIDES: Slide[] = [
  {
    key: "card",
    eyebrow: "Spend with control",
    lines: ["One card for", "everything you buy."],
    body: "A Zeva card for suppliers, labs and bills. Lock cards to approved vendors and see every charge itemized by patient and Rx.",
    hero: <HeroCard />,
  },
  {
    key: "flow",
    eyebrow: "One account",
    lines: ["Money in,", "money out."],
    body: "Patient payments flow in, suppliers, payroll and rent flow out. Every dollar your clinic moves, tracked in real time.",
    hero: <HeroFlow />,
  },
  {
    key: "instant",
    eyebrow: "Instant disbursement",
    lines: ["Get paid the", "moment they tap."],
    body: "No 2–3 day reconciliation wait. Patient card payments settle to your balance instantly, so your cash is always current.",
    hero: <HeroInstant />,
  },
  {
    key: "bills",
    eyebrow: "Bill pay",
    lines: ["Pay every bill,", "on time."],
    body: "Utilities, rent and vendor invoices in one hub. Pick a card, tap to pay, and it lands at the top of your activity instantly.",
    hero: <HeroBills />,
  },
];

export function Onboarding({ onStart, onSignin }: { onStart: () => void; onSignin: () => void }) {
  const n = SLIDES.length;
  const sp = new URLSearchParams(location.search);
  const startAt = Number(sp.get("slide")) || 0;
  const [i, setI] = useState(Math.max(0, Math.min(n - 1, startAt)));
  const [dir, setDir] = useState(1); // slide direction for enter/exit
  const paused = useRef(sp.has("slide")); // deep-linked → don't auto-advance
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!paused.current) {
        setDir(1);
        setI((x) => (x + 1) % n); // auto-advance loops
      }
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, n]);

  const slide = SLIDES[i];
  const go = (d: number) => {
    paused.current = true; // user is driving now
    setDir(d);
    setI((x) => (x + d + n) % n); // loops both directions
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <AnimatedBackground variant="waves" intensity={0.9} />
      {/* NeoPop grid substrate — adds depth, fades toward the copy */}
      <div
        className="grid-pattern-teal pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(120% 70% at 50% 22%, black 0%, transparent 62%)", WebkitMaskImage: "radial-gradient(120% 70% at 50% 22%, black 0%, transparent 62%)" }}
      />

      {/* story progress bars */}
      <div className="relative z-20 flex gap-1.5 px-5 pt-4">
        {SLIDES.map((s, idx) => (
          <div key={s.key} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
            {idx < i && <div className="h-full w-full bg-white/80" />}
            {idx === i && (
              <motion.div
                key={`fill-${i}`}
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: (i === SLIDES.length - 1 ? 0.6 : SLIDE_MS / 1000), ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* brand row */}
      <div className="relative z-20 flex items-center gap-2 px-5 pt-3">
        <ZevaMark size={20} tone="teal" />
        <span className="font-display text-[15px] font-semibold lowercase tracking-tight text-ink">{APP_NAME}</span>
      </div>

      {/* swipe + tap navigation layer (loops) */}
      <motion.div
        ref={dragRef}
        className="absolute inset-x-0 top-[92px] bottom-[128px] z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -55) go(1);
          else if (info.offset.x > 55) go(-1);
        }}
        onTap={(_, info) => {
          const r = dragRef.current?.getBoundingClientRect();
          if (!r) return;
          go((info.point.x - r.left) / r.width < 0.35 ? -1 : 1);
        }}
      />

      {/* hero — keyed remount (no mode=wait blank gap) */}
      <div className="relative z-0 h-[38vh] max-h-[300px] min-h-[180px] flex-none px-5">
        <motion.div
          key={slide.key + "-hero"}
          className="h-full"
          initial={{ opacity: 0, x: dir * 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {slide.hero}
        </motion.div>
      </div>

      {/* copy */}
      <div className="relative z-20 flex-1 px-6">
        <motion.div
          key={slide.key + "-copy"}
          initial={{ opacity: 0, x: dir * 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-2">{slide.eyebrow}</div>
          <TitleReveal lines={slide.lines} k={slide.key} />
          <p className="mt-2.5 text-[13px] leading-relaxed text-dim">{slide.body}</p>
        </motion.div>
      </div>

      {/* CTAs */}
      <div className="relative z-20 px-6 pb-8 pt-1">
        <NeoPopButton onClick={onStart} className="w-full" faceClassName="px-5 py-4 text-[15.5px] font-medium">
          Get started
          <ChevronRight size={18} strokeWidth={2.2} />
        </NeoPopButton>
      </div>
    </div>
  );
}
