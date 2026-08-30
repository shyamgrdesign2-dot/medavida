import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import { ZevaCard } from "./ZevaCard";
import { CARDS } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const GUT = 24; // side gutter that holds the swipe hint (left) + dots (right)

/**
 * Apple-Wallet-style stacked wallet. Swipe the front card up to cycle; tap it to
 * open the Cards screen. The swipe hint lives vertically in the LEFT gutter and
 * the active-card dots vertically in the RIGHT gutter — never on the card face.
 */
export function CardWallet({ width = 320, onCardTap }: { width?: number; onCardTap?: (index: number) => void }) {
  const [order, setOrder] = useState(CARDS.map((_, i) => i));
  const cycle = () => { haptic("impact"); setOrder((o) => [...o.slice(1), o[0]]); };
  const front = order[0];
  const lastTap = useRef(0);
  // double-tap opens Cards — a single tap during a swipe must NOT navigate
  const handleTap = (idx: number) => {
    const now = performance.now();
    if (now - lastTap.current < 320) { lastTap.current = 0; haptic("tap"); onCardTap?.(idx); }
    else lastTap.current = now;
  };

  const cardW = width - GUT * 2;
  const cardH = cardW / 1.586;
  const peek = 24;
  const multi = CARDS.length > 1;

  return (
    <div className="relative mx-auto" style={{ width, height: cardH + peek * 2 + 6 }}>
      {/* LEFT gutter — vertical swipe hint */}
      {multi && (
        <div className="pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 flex-col items-center" style={{ width: GUT }}>
          <motion.div className="flex flex-col items-center" animate={{ y: [0, -3, 0], opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronUp size={13} strokeWidth={2.8} style={{ color: "var(--color-teal-2)" }} />
            <span className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-faint" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>swipe</span>
          </motion.div>
        </div>
      )}

      {/* RIGHT gutter — vertical dots */}
      {multi && (
        <div className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5" style={{ width: GUT }}>
          {CARDS.map((c, i) => (
            <motion.span
              key={c.id}
              className="rounded-full"
              animate={{ height: front === i ? 15 : 5, opacity: front === i ? 1 : 0.5 }}
              style={{ width: 3, background: front === i ? "linear-gradient(180deg,#5cffef,#0fd8c8)" : "rgba(255,255,255,0.22)" }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
            />
          ))}
        </div>
      )}

      {/* card stack, inset within the gutters */}
      <div className="relative mx-auto" style={{ width: cardW, height: cardH + peek * 2 + 6 }}>
        {CARDS.map((card, idx) => {
          const pos = order.indexOf(idx);
          const isFront = pos === 0;
          return (
            <motion.div
              key={card.id}
              className="absolute left-0 right-0"
              style={{ zIndex: CARDS.length - pos, touchAction: "none" }}
              animate={{ y: pos * peek, scale: 1 - pos * 0.06, opacity: pos > 2 ? 0 : 1 - pos * 0.12 }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              drag={isFront ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              dragSnapToOrigin
              onDragEnd={(_, info) => { if (info.offset.y < -26 || info.velocity.y < -180) cycle(); }}
              onTap={() => { if (isFront) handleTap(idx); }}
            >
              <div className="pointer-events-none absolute -inset-x-1 bottom-0 top-2 rounded-[10px]" style={{ boxShadow: isFront ? "0 18px 30px -18px rgba(0,0,0,0.8)" : "none" }} />
              <ZevaCard card={card} interactive={isFront} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
