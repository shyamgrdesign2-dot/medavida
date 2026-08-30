import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Check, Delete, Zap, CreditCard, Link2, MessageSquare } from "lucide-react";
import { NeoPopButton } from "@/components/NeoPopButton";
import { money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

// Recent patients (card-on-file) + a "new" option. Inflow is the core value prop:
// patient pays via MetaPay → ~2% fee → clinic gets net disbursed INSTANTLY.
const PATIENTS = [
  { id: "MFH-2831", initials: "AR" },
  { id: "MFH-2830", initials: "JT" },
  { id: "MFH-2822", initials: "LM" },
  { id: "MFH-2790", initials: "DP" },
  { id: "new", initials: "+" },
];
const PROGRAMS = ["Semaglutide 0.5mg", "GLP-1 program", "Lab panel", "Consult", "Peptide therapy"];
const FEE = 0.02;

export function CollectPayment({ onBack }: { onBack: () => void }) {
  const [pt, setPt] = useState(0);
  const [prog, setProg] = useState(0);
  const [amount, setAmount] = useState("0");
  const [done, setDone] = useState(false);
  const [link, setLink] = useState(false); // false = charge card-on-file now, true = send a pay link

  const val = parseFloat(amount) || 0;
  const fee = Math.round(val * FEE * 100) / 100;
  const net = Math.round((val - fee) * 100) / 100;

  const press = (k: string) => {
    haptic("tap");
    setAmount((a) => {
      if (k === "del") return a.length <= 1 ? "0" : a.slice(0, -1);
      if (k === ".") return a.includes(".") ? a : a + ".";
      if (a === "0") return k === "." ? "0." : k;
      if (a.includes(".") && a.split(".")[1].length >= 2) return a;
      if (!a.includes(".") && a.length >= 7) return a; // cap whole-dollar digits so the amount never overflows
      return a + k;
    });
  };
  const submit = () => { if (val <= 0) return; haptic("success"); setDone(true); setTimeout(onBack, 2200); };

  if (done) {
    const who = PATIENTS[pt].id === "new" ? "New patient" : PATIENTS[pt].id;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-bg px-6">
        <motion.div className="flex h-20 w-20 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 40 }}>
          {link ? <MessageSquare size={36} strokeWidth={2.4} /> : <Check size={40} strokeWidth={3} />}
        </motion.div>
        <div className="mt-5 font-display text-[24px] font-semibold text-ink">{link ? "Link sent" : `${money(val)} collected`}</div>
        <div className="mt-1 text-[13px] text-dim">{who} · {PROGRAMS[prog]}</div>
        {link ? (
          <motion.div className="mt-6 w-full max-w-[300px] rounded-[14px] border border-teal/25 bg-teal/8 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between text-[12.5px]"><span className="text-dim">Requested</span><span className="tnum font-semibold text-ink">{money(val)}</span></div>
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-dim"><MessageSquare size={13} strokeWidth={2.2} className="text-teal-2" /> Sent by SMS &amp; email · secure MetaPay page</div>
            <div className="my-2.5 border-t border-teal/20" />
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-2"><Zap size={14} strokeWidth={2.4} />Net {money(net)} lands instantly when they pay</div>
          </motion.div>
        ) : (
          <motion.div className="mt-6 w-full max-w-[300px] rounded-[14px] border border-teal/25 bg-teal/8 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between text-[12.5px]"><span className="text-dim">Collected</span><span className="tnum font-semibold text-ink">{money(val)}</span></div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px]"><span className="text-dim">MetaPay fee (2%)</span><span className="tnum font-semibold text-ink">−{money(fee)}</span></div>
            <div className="my-2.5 border-t border-teal/20" />
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-2"><Zap size={14} strokeWidth={2.4} />Disbursed instantly</span><span className="tnum font-display text-[16px] font-semibold text-ink">{money(net)}</span></div>
            <div className="mt-1 text-[10.5px] text-faint">to Operating ···· 5528 · no reconciliation wait</div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div className="font-display text-[18px] font-semibold text-ink">Collect payment</div>
      </div>

      {/* method toggle: charge card-on-file now vs. send a payment link */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-1 rounded-[12px] border border-border bg-surface-2 p-1">
        {[{ k: false, label: "Charge now", icon: CreditCard }, { k: true, label: "Send link", icon: Link2 }].map((m) => {
          const on = link === m.k;
          return (
            <button key={m.label} onClick={() => { haptic("select"); setLink(m.k); }} className="relative flex items-center justify-center gap-1.5 rounded-[9px] py-2.5">
              {on && <motion.span layoutId="collectpill" className="absolute inset-0 rounded-[9px] border border-teal/40 bg-teal/12" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
              <m.icon size={14} strokeWidth={2.2} className={"relative " + (on ? "text-teal-2" : "text-dim")} />
              <span className={"relative text-[12.5px] font-semibold " + (on ? "text-ink" : "text-dim")}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* patient picker (card-on-file) */}
      <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {PATIENTS.map((p, i) => {
          const on = pt === i;
          const isNew = p.id === "new";
          return (
            <button key={p.id} onClick={() => { haptic("tap"); setPt(i); }} className={"flex w-[70px] flex-none flex-col items-center gap-1.5 rounded-[12px] border p-2.5 transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
              <span className={"flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold " + (isNew ? "bg-teal/12 text-teal-2" : "bg-surface-2 text-ink")}>{p.initials}</span>
              <span className="w-full truncate text-center text-[9.5px] font-semibold text-dim">{isNew ? "New" : p.id}</span>
            </button>
          );
        })}
      </div>

      {/* program / memo chips */}
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-5 pb-1">
        {PROGRAMS.map((p, i) => (
          <button key={p} onClick={() => { haptic("tap"); setProg(i); }} className={"flex-none rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors " + (prog === i ? "border-teal bg-teal text-on-teal" : "border-border bg-surface text-dim")}>{p}</button>
        ))}
      </div>

      {/* amount + live fee breakdown */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{link ? <><Link2 size={13} strokeWidth={2.2} />Request via link</> : <><CreditCard size={13} strokeWidth={2.2} />Charge card on file</>}</div>
        {(() => { const d = money(val).replace(".00", ""); const fs = d.length > 9 ? 38 : d.length > 7 ? 44 : 52; return (
          <div className="tnum mt-2 font-display font-semibold leading-none text-ink" style={{ fontSize: fs }}>{d}</div>
        ); })()}
        {val > 0 && (
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-[11.5px] font-medium text-teal-2">
            <Zap size={13} strokeWidth={2.4} /> Net {money(net).replace(".00", "")} instantly · 2% fee
          </div>
        )}
      </div>

      {/* keypad */}
      <div className="grid flex-none grid-cols-3 gap-1 px-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
          <button key={k} onClick={() => press(k)} className="flex h-[52px] items-center justify-center rounded-[10px] text-[22px] font-semibold text-ink active:bg-surface">
            {k === "del" ? <Delete size={22} strokeWidth={2} className="text-dim" /> : k}
          </button>
        ))}
      </div>

      <div className="flex-none px-6 pb-8 pt-2">
        <NeoPopButton onClick={submit} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
          {link ? `Send link${val > 0 ? " · " + money(val).replace(".00", "") : ""}` : `Charge ${val > 0 ? money(val).replace(".00", "") : "card"}`}
        </NeoPopButton>
      </div>
    </div>
  );
}
