import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Check, Delete, ChevronDown, Wallet } from "lucide-react";
import { PatternAvatar, Icon } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { BottomSheet } from "@/components/BottomSheet";
import { money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

type Mode = "send" | "move" | "add";

const RECIPIENTS = [
  { id: "fullscript", name: "Fullscript", sub: "Supplement vendor", icon: "Pill" },
  { id: "mckesson", name: "McKesson Medical", sub: "Rx wholesaler", icon: "Truck" },
  { id: "rupa", name: "Rupa Health", sub: "Lab partner", icon: "HeartPulse" },
  { id: "payroll", name: "Staff payroll", sub: "4 employees", icon: "Users" },
  { id: "rent", name: "Downtown Wellness", sub: "Landlord · rent", icon: "Building2" },
];
const ACCOUNTS = [
  { id: "operating", name: "Operating", bal: 128450.2 },
  { id: "payroll", name: "Payroll", bal: 41200 },
  { id: "supplies", name: "Supplies & Inventory", bal: 9860 },
  { id: "tax", name: "Tax reserve", bal: 14730 },
];

export function MoveMoney({ mode = "send", onBack }: { mode?: Mode; onBack: () => void }) {
  const targets = mode === "move" || mode === "add" ? ACCOUNTS : RECIPIENTS;
  const [target, setTarget] = useState(0);
  const [amount, setAmount] = useState("0");
  // "add" is a top-up from an external bank, so it has no internal source account
  const [fromIdx, setFromIdx] = useState(mode === "move" ? 1 : 0);
  const [pickFrom, setPickFrom] = useState(false);
  const [done, setDone] = useState(false);

  const title = mode === "send" ? "Send money" : mode === "add" ? "Add money" : "Move money";
  const val = parseFloat(amount) || 0;
  const from = ACCOUNTS[fromIdx];
  const hasSource = mode !== "add";
  // in "move" mode the funding account can't be the destination account
  const sameAccount = mode === "move" && targets[target]?.id === from.id;
  const insufficient = hasSource && val > from.bal;
  const blocked = val <= 0 || (hasSource && (insufficient || sameAccount));

  const chooseFrom = (i: number) => {
    haptic("tap");
    setFromIdx(i);
    setPickFrom(false);
  };

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
  const submit = () => { if (blocked) return; haptic("success"); setDone(true); setTimeout(onBack, 1600); };

  if (done) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-bg px-6">
        <motion.div className="flex h-20 w-20 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 40 }}>
          <Check size={40} strokeWidth={3} />
        </motion.div>
        <div className="mt-5 font-display text-[24px] font-semibold text-ink">{money(val)} {mode === "add" ? "added" : mode === "move" ? "moved" : "sent"}</div>
        <div className="mt-1 text-[13px] text-dim">{hasSource ? `from ${from.name} ` : ""}{mode === "send" ? "to" : "into"} {(targets[target] as any).name} · instantly</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div className="font-display text-[18px] font-semibold text-ink">{title}</div>
      </div>

      {/* target picker */}
      <div className="no-scrollbar -mx-1 mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1">
        {targets.map((t: any, i) => {
          const on = target === i;
          return (
            <button key={t.id} onClick={() => { haptic("tap"); setTarget(i); }} className={"flex w-[74px] flex-none flex-col items-center gap-1.5 rounded-[10px] border p-2.5 transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
              {"icon" in t ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink"><Icon name={t.icon} size={16} /></span>
              ) : (
                <PatternAvatar size={36} label={t.name.slice(0, 2).toUpperCase()} />
              )}
              <span className="w-full truncate text-center text-[10px] font-semibold text-ink">{t.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* amount */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{mode === "add" ? "Add to" : "To"} {(targets[target] as any).name}</div>
        {(() => { const d = money(val).replace(".00", ""); const fs = d.length > 9 ? 38 : d.length > 7 ? 44 : 52; return (
          <div className="tnum mt-2 font-display font-semibold leading-none text-ink" style={{ fontSize: fs }}>{d}</div>
        ); })()}
        {hasSource && (
          <>
            <motion.button
              onClick={() => { haptic("tap"); setPickFrom(true); }}
              whileTap={{ scale: 0.96 }}
              aria-label="Change funding account"
              className={"mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors " + (insufficient || sameAccount ? "border-stop/40 bg-stop/8 text-stop" : "border-border bg-surface text-dim")}
            >
              From {from.name} · {money(from.bal).replace(".00", "")} <ChevronDown size={13} strokeWidth={2.4} />
            </motion.button>
            <div className="mt-1.5 h-4 text-[11px] font-semibold text-stop">
              {sameAccount ? "Pick a different source account" : insufficient ? "Not enough in this account" : ""}
            </div>
          </>
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
        <div className={"transition-opacity " + (blocked ? "opacity-45" : "opacity-100")}>
          <NeoPopButton onClick={submit} className="w-full" faceClassName="px-5 py-4 text-[15px] font-medium">
            {mode === "add" ? "Add" : mode === "move" ? "Move" : "Send"} {val > 0 ? money(val).replace(".00", "") : ""}
          </NeoPopButton>
        </div>
      </div>

      {/* funding-account picker */}
      <BottomSheet open={pickFrom} onClose={() => setPickFrom(false)} title="Pay from">
        <div className="space-y-2">
          {ACCOUNTS.map((a, i) => {
            const on = i === fromIdx;
            const isDest = mode === "move" && targets[target]?.id === a.id;
            const low = val > 0 && val > a.bal;
            return (
              <button
                key={a.id}
                onClick={() => { if (!isDest) chooseFrom(i); }}
                disabled={isDest}
                className={"flex w-full items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface") + (isDest ? " opacity-40" : "")}
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-2 text-teal-2"><Wallet size={18} strokeWidth={2.2} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ink">{a.name}</span>
                  <span className={"block text-[11.5px] " + (low ? "text-stop" : "text-dim")}>
                    {money(a.bal).replace(".00", "")} available{isDest ? " · destination" : low ? " · too low" : ""}
                  </span>
                </span>
                {on && <Check size={18} strokeWidth={3} className="flex-none text-teal-2" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}
