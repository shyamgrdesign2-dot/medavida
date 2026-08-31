import { useState } from "react";
import { motion } from "motion/react";
import { Delete } from "lucide-react";
import { ArrowLeft2, TickCircle, ArrowDown2, Bank, Card, Add, Building } from "iconsax-react";
import { Icon, InputField } from "@/components/ui";
import { NeoPopButton } from "@/components/NeoPopButton";
import { BottomSheet } from "@/components/BottomSheet";
import { CARDS, money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

type Mode = "send" | "move" | "add";

interface Recipient { id: string; name: string; sub: string; icon: string; bank: string; acct: string; routing: string }
const INITIAL_RECIPIENTS: Recipient[] = [
  { id: "fullscript", name: "Fullscript", sub: "Supplement vendor", icon: "Pill", bank: "Chase Business", acct: "••4821", routing: "021000021" },
  { id: "mckesson", name: "McKesson Medical", sub: "Rx wholesaler", icon: "Truck", bank: "Bank of America", acct: "••7014", routing: "026009593" },
  { id: "rupa", name: "Rupa Health", sub: "Lab partner", icon: "HeartPulse", bank: "Wells Fargo", acct: "••3382", routing: "121000248" },
  { id: "payroll", name: "Staff payroll", sub: "4 employees", icon: "Users", bank: "ACH batch", acct: "4 accounts", routing: "direct deposit" },
  { id: "rent", name: "Downtown Wellness", sub: "Landlord · rent", icon: "Building2", bank: "Chase", acct: "••9920", routing: "021000021" },
];
// The ONLY funding sources are the debit + credit card — no internal wallets/accounts.
const CARD_SRC = CARDS.map((c) => ({ id: c.id, name: c.label, type: c.type, last4: c.last4, bal: c.balance }));

export function MoveMoney({ mode = "send", onBack }: { mode?: Mode; onBack: () => void }) {
  const [recipients, setRecipients] = useState(INITIAL_RECIPIENTS);
  const targets: any[] = mode === "send" ? recipients : CARD_SRC;
  const [target, setTarget] = useState(0);
  const [amount, setAmount] = useState("0");
  const [fromIdx, setFromIdx] = useState(mode === "move" ? 1 : 0); // move: default to the other card
  const [pickFrom, setPickFrom] = useState(false);
  const [pickTarget, setPickTarget] = useState(false);
  const [addingR, setAddingR] = useState(false);
  const [rName, setRName] = useState(""); const [rBank, setRBank] = useState("");
  const [rAcct, setRAcct] = useState(""); const [rRouting, setRRouting] = useState("");
  const [done, setDone] = useState(false);

  const title = mode === "send" ? "Send money" : mode === "add" ? "Add money" : "Move money";
  const val = parseFloat(amount) || 0;
  const from = CARD_SRC[fromIdx] ?? CARD_SRC[0];
  const fromLabel = `${from.name} ${from.type}`;
  const tgt = targets[target];
  const hasSource = mode !== "add"; // "add" tops a card up from an external bank — no source card
  const sameAccount = mode === "move" && tgt?.id === from.id;
  const insufficient = hasSource && val > from.bal;
  const blocked = val <= 0 || (hasSource && (insufficient || sameAccount));

  const chooseFrom = (i: number) => { haptic("tap"); setFromIdx(i); setPickFrom(false); };
  const addRecipient = () => {
    if (!rName.trim() || rAcct.replace(/\D/g, "").length < 3) return;
    haptic("success");
    const id = "r" + recipients.length;
    setRecipients((rs) => [...rs, { id, name: rName.trim(), sub: "New payee · ACH", icon: "Building2", bank: rBank.trim() || "Bank", acct: rAcct.startsWith("••") ? rAcct : "••" + rAcct.slice(-4), routing: rRouting.trim() || "—" }]);
    setTarget(recipients.length);
    setRName(""); setRBank(""); setRAcct(""); setRRouting(""); setAddingR(false); setPickTarget(false);
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
          <TickCircle size={40} variant="Bulk" color="var(--color-go)" />
        </motion.div>
        <div className="mt-5 font-display text-[24px] font-semibold text-ink">{money(val)} {mode === "add" ? "added" : mode === "move" ? "moved" : "sent"}</div>
        <div className="mt-1 text-[13px] text-dim">{hasSource ? `from ${fromLabel} ` : ""}{mode === "send" ? "to" : mode === "add" ? "onto" : "to"} {tgt.name}{mode !== "send" ? ` ${tgt.type ?? ""}` : ""} · instantly</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div className="font-display text-[18px] font-semibold text-ink">{title}</div>
      </div>

      {/* target as a labeled dropdown (send: payee · move/add: card) */}
      <button onClick={() => { haptic("tap"); setPickTarget(true); }} className="card-lift mx-5 mt-4 flex items-center gap-2.5 rounded-[12px] border border-border bg-surface px-3 py-2 text-left">
        {"icon" in tgt ? (
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Icon name={tgt.icon} size={17} /></span>
        ) : (
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Card size={17} variant="Bulk" color="var(--color-teal-2)" /></span>
        )}
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[9px] font-bold uppercase tracking-wide text-faint">{mode === "send" ? "Pay to" : mode === "add" ? "Add to" : "Move to"}</span>
          <span className="block truncate text-[13.5px] font-semibold text-ink">{mode === "send" ? tgt.name : tgt.type === "credit" ? "Credit card" : "Debit card"}</span>
          <span className="block truncate text-[11px] text-dim">{mode === "send" ? tgt.sub : "•••• " + tgt.last4 + " · " + money(tgt.bal).replace(".00", "") + " available"}</span>
        </span>
        <ArrowDown2 size={16} variant="Linear" color="var(--color-teal-2)" className="flex-none" />
      </button>

      {/* recipient bank details — you're sending an ACH transfer to their account */}
      {mode === "send" && (
        <div className="mx-5 mt-3 rounded-[12px] border border-border bg-surface-2 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
            <Bank size={12} variant="Bulk" color="var(--color-teal-2)" /> Deposits to their account · ACH
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ k: "Bank", v: tgt.bank }, { k: "Account", v: tgt.acct }, { k: "Routing", v: tgt.routing }].map((f) => (
              <div key={f.k} className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wide text-faint">{f.k}</div>
                <div className="tnum truncate text-[12px] font-semibold text-ink">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* amount */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{mode === "add" ? "Add to" : "To"} {tgt.name}</div>
        {(() => { const d = money(val).replace(".00", ""); const fs = d.length > 9 ? 38 : d.length > 7 ? 44 : 52; return (
          <div className="tnum mt-2 font-display font-semibold leading-none text-ink" style={{ fontSize: fs }}>{d}</div>
        ); })()}
        {hasSource && (
          <>
            <motion.button
              onClick={() => { haptic("tap"); setPickFrom(true); }}
              whileTap={{ scale: 0.96 }}
              aria-label="Change funding card"
              className={"mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors " + (insufficient || sameAccount ? "border-stop/40 bg-stop/8 text-stop" : "border-border bg-surface text-dim")}
            >
              <Card size={13} variant="Bulk" color="currentColor" />
              From {from.type === "credit" ? "Credit" : "Debit"} card · {money(from.bal).replace(".00", "")} <ArrowDown2 size={13} variant="Linear" color="currentColor" />
            </motion.button>
            <div className="mt-1.5 h-4 text-[11px] font-semibold text-stop">
              {sameAccount ? "Pick the other card" : insufficient ? (from.type === "credit" ? "Over available credit" : "Not enough on this card") : ""}
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

      {/* funding-card picker (debit / credit) */}
      <BottomSheet open={pickFrom} onClose={() => setPickFrom(false)} title="Pay with card">
        <div className="space-y-2">
          {CARD_SRC.map((a, i) => {
            const on = i === fromIdx;
            const isDest = mode === "move" && tgt?.id === a.id;
            const low = val > 0 && val > a.bal;
            return (
              <button key={a.id} onClick={() => { if (!isDest) chooseFrom(i); }} disabled={isDest}
                className={"flex w-full items-center gap-3 rounded-[12px] border p-3 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface") + (isDest ? " opacity-40" : "")}>
                <span className="flex h-9 w-12 flex-none items-center justify-center rounded-md" style={{ background: a.type === "credit" ? "linear-gradient(135deg,#0c211d,#05423a)" : "linear-gradient(135deg,#16201f,#08130f)", boxShadow: "inset 0 0 0 1px rgba(35,255,237,0.2)" }}>
                  <Bank size={16} variant="Bulk" color="#eafff9" />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">{a.type === "credit" ? "Credit card" : "Debit card"}</span>
                  <span className={"block text-[11px] " + (low ? "text-stop" : "text-dim")}>
                    •••• {a.last4} · {money(a.bal).replace(".00", "")}{isDest ? " · destination" : low ? " · too low" : ""}
                  </span>
                </span>
                {on && <TickCircle size={18} variant="Bulk" color="var(--color-teal-2)" className="flex-none" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* target picker (+ add payee for send) */}
      <BottomSheet open={pickTarget} onClose={() => { setPickTarget(false); setAddingR(false); }} title={addingR ? "New payee" : mode === "send" ? "Pay to" : mode === "add" ? "Add to" : "Move to"} onBack={addingR ? () => setAddingR(false) : undefined}>
        {addingR ? (
          <div className="space-y-3">
            <InputField label="Payee name" value={rName} onChange={setRName} placeholder="e.g. Bright Media LLC" prefix={<Building size={16} variant="Linear" color="var(--color-faint)" />} />
            <InputField label="Bank name" value={rBank} onChange={setRBank} placeholder="e.g. Chase" prefix={<Bank size={16} variant="Linear" color="var(--color-faint)" />} />
            <div className="grid grid-cols-2 gap-2">
              <InputField label="Account no." value={rAcct} onChange={(v) => setRAcct(v.replace(/[^\d]/g, ""))} placeholder="1234" type="tel" />
              <InputField label="Routing" value={rRouting} onChange={(v) => setRRouting(v.replace(/[^\d]/g, ""))} placeholder="021000021" type="tel" />
            </div>
            <NeoPopButton onClick={addRecipient} className="w-full" faceClassName="px-5 py-3.5 text-[14.5px] font-semibold"><Add size={17} variant="Linear" color="currentColor" /> Add payee</NeoPopButton>
          </div>
        ) : (
          <div className="space-y-2">
            {targets.map((t: any, i) => {
              const on = i === target;
              const isCard = !("icon" in t);
              return (
                <button key={t.id} onClick={() => { haptic("tap"); setTarget(i); setPickTarget(false); }} className={"flex w-full items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
                  {isCard ? (
                    <span className="flex h-9 w-12 flex-none items-center justify-center rounded-md" style={{ background: t.type === "credit" ? "linear-gradient(135deg,#0c211d,#05423a)" : "linear-gradient(135deg,#16201f,#08130f)", boxShadow: "inset 0 0 0 1px rgba(35,255,237,0.2)" }}><Bank size={16} variant="Bulk" color="#eafff9" /></span>
                  ) : (
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-2 text-ink"><Icon name={t.icon} size={18} /></span>
                  )}
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[13.5px] font-semibold text-ink">{isCard ? (t.type === "credit" ? "Credit card" : "Debit card") : t.name}</span>
                    <span className="block truncate text-[11px] text-dim">{isCard ? "•••• " + t.last4 + " · " + money(t.bal).replace(".00", "") + " available" : `${t.sub} · ${t.bank} ${t.acct}`}</span>
                  </span>
                  {on && <TickCircle size={18} variant="Bulk" color="var(--color-teal-2)" className="flex-none" />}
                </button>
              );
            })}
            {mode === "send" && (
              <button onClick={() => { haptic("tap"); setAddingR(true); }} className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-teal/40 bg-teal/5 p-3.5 text-left">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Add size={20} variant="Linear" color="currentColor" /></span>
                <span className="text-[13.5px] font-semibold text-teal-2">Add a new payee</span>
              </button>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
