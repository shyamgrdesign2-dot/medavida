import { useState } from "react";
import { motion } from "motion/react";
import { Delete } from "lucide-react";
import { ArrowLeft2, TickCircle, Flash, Card, Link21, Message, ArrowDown2, Add, Profile, Call, ReceiptText } from "iconsax-react";
import { NeoPopButton } from "@/components/NeoPopButton";
import { BottomSheet } from "@/components/BottomSheet";
import { InputField } from "@/components/ui";
import { money } from "@/lib/data";
import { haptic } from "@/lib/haptics";

// Patients with card-on-file + mobile (a pay link is texted to this number).
interface Patient { id: string; name: string; initials: string; mobile: string }
const INITIAL_PATIENTS: Patient[] = [
  { id: "SGR-2831", name: "Ana Rivera", initials: "AR", mobile: "(512) 555-2831" },
  { id: "SGR-2830", name: "Jon Tan", initials: "JT", mobile: "(512) 555-2830" },
  { id: "SGR-2822", name: "Lena Marsh", initials: "LM", mobile: "(512) 555-2822" },
  { id: "SGR-2790", name: "Dev Patel", initials: "DP", mobile: "(512) 555-2790" },
];
const INITIAL_PROGRAMS = ["Semaglutide 0.5mg", "GLP-1 program", "Lab panel", "Consult", "Peptide therapy"];
const INITIAL_TAXES = [
  { id: "none", label: "No tax", rate: 0 },
  { id: "sales", label: "Sales tax 8.25%", rate: 0.0825 },
  { id: "svc", label: "Wellness svc 5%", rate: 0.05 },
];
const FEE = 0.02;

export function CollectPayment({ onBack }: { onBack: () => void }) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [ptId, setPtId] = useState(INITIAL_PATIENTS[0].id);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [prog, setProg] = useState(0);
  const [taxes, setTaxes] = useState(INITIAL_TAXES);
  const [taxIdx, setTaxIdx] = useState(0);
  const [amount, setAmount] = useState("0");
  const [done, setDone] = useState(false);
  const [link, setLink] = useState(false); // false = charge card-on-file now, true = send a pay link

  // one sheet at a time: patient | program | tax
  const [sheet, setSheet] = useState<null | "patient" | "program" | "tax">(null);
  const [adding, setAdding] = useState(false);
  const [nName, setNName] = useState(""); const [nMobile, setNMobile] = useState("");
  const [nProg, setNProg] = useState("");
  const [nTaxLabel, setNTaxLabel] = useState(""); const [nTaxRate, setNTaxRate] = useState("");

  const patient = patients.find((p) => p.id === ptId) ?? patients[0];
  const tax = taxes[taxIdx] ?? taxes[0];

  const val = parseFloat(amount) || 0;
  const taxAmt = Math.round(val * tax.rate * 100) / 100;
  const total = Math.round((val + taxAmt) * 100) / 100;
  const fee = Math.round(total * FEE * 100) / 100;
  const net = Math.round((total - fee) * 100) / 100;

  const close = () => { setSheet(null); setAdding(false); };
  const addPatient = () => {
    if (!nName.trim() || nMobile.replace(/\D/g, "").length < 10) return;
    haptic("success");
    const id = "SGR-" + (2832 + patients.length);
    const initials = nName.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    setPatients((ps) => [...ps, { id, name: nName.trim(), initials, mobile: nMobile.trim() }]);
    setPtId(id); setNName(""); setNMobile(""); close();
  };
  const addProgram = () => {
    if (!nProg.trim()) return;
    haptic("success");
    setPrograms((ps) => [...ps, nProg.trim()]); setProg(programs.length); setNProg(""); close();
  };
  const addTax = () => {
    const rate = parseFloat(nTaxRate);
    if (!nTaxLabel.trim() || !(rate > 0)) return;
    haptic("success");
    setTaxes((ts) => [...ts, { id: "custom-" + ts.length, label: `${nTaxLabel.trim()} ${rate}%`, rate: rate / 100 }]);
    setTaxIdx(taxes.length); setNTaxLabel(""); setNTaxRate(""); close();
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
  const submit = () => { if (val <= 0) return; haptic("success"); setDone(true); setTimeout(onBack, 2200); };

  if (done) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-bg px-6">
        <motion.div className="flex h-20 w-20 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 360, damping: 40 }}>
          {link ? <Message size={36} variant="Bulk" color="var(--color-go)" /> : <TickCircle size={40} variant="Bulk" color="var(--color-go)" />}
        </motion.div>
        <div className="mt-5 font-display text-[24px] font-semibold text-ink">{link ? "Link sent" : `${money(total)} collected`}</div>
        <div className="mt-1 text-[13px] text-dim">{patient.name} · {programs[prog]}</div>
        {link ? (
          <motion.div className="mt-6 w-full max-w-[300px] rounded-[14px] border border-teal/25 bg-teal/8 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between text-[12.5px]"><span className="text-dim">Requested</span><span className="tnum font-semibold text-ink">{money(total)}</span></div>
            <div className="mt-2 flex items-center gap-1.5 text-[12px] text-dim"><Message size={13} variant="Linear" color="var(--color-teal-2)" /> Texted to {patient.mobile}</div>
            <div className="my-2.5 border-t border-teal/20" />
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-2"><Flash size={14} variant="Linear" color="currentColor" />Net {money(net)} lands instantly when they pay</div>
          </motion.div>
        ) : (
          <motion.div className="mt-6 w-full max-w-[300px] rounded-[14px] border border-teal/25 bg-teal/8 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between text-[12.5px]"><span className="text-dim">Collected</span><span className="tnum font-semibold text-ink">{money(total)}</span></div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px]"><span className="text-dim">Zeva Pay fee (2%)</span><span className="tnum font-semibold text-ink">−{money(fee)}</span></div>
            <div className="my-2.5 border-t border-teal/20" />
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-2"><Flash size={14} variant="Linear" color="currentColor" />Disbursed instantly</span><span className="tnum font-display text-[16px] font-semibold text-ink">{money(net)}</span></div>
            <div className="mt-1 text-[10.5px] text-faint">to Operating ···· 5528 · no reconciliation wait</div>
          </motion.div>
        )}
      </div>
    );
  }

  // labeled dropdown trigger
  const Dropdown = ({ label, value, onClick }: { label: string; value: string; onClick: () => void }) => (
    <button onClick={onClick} className="card-lift flex items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-left">
      <span className="min-w-0 leading-tight">
        <span className="block text-[9px] font-bold uppercase tracking-wide text-faint">{label}</span>
        <span className="block truncate text-[12.5px] font-semibold text-ink">{value}</span>
      </span>
      <ArrowDown2 size={15} variant="Linear" color="var(--color-teal-2)" className="flex-none" />
    </button>
  );

  return (
    <div className="flex h-full w-full flex-col bg-bg">
      <div className="flex flex-none items-center gap-3 px-5 pt-4">
        <button onClick={() => { haptic("tap"); onBack(); }} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink"><ArrowLeft2 size={18} variant="Linear" color="currentColor" /></button>
        <div className="font-display text-[18px] font-semibold text-ink">Collect payment</div>
      </div>

      {/* 1. patient FIRST — pick who's paying before anything else */}
      <button onClick={() => { haptic("tap"); setSheet("patient"); }} className="card-lift mx-5 mt-4 flex items-center gap-2.5 rounded-[12px] border border-border bg-surface px-3 py-2 text-left">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/12 text-[12px] font-bold text-teal-2">{patient.initials}</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13.5px] font-semibold text-ink">{patient.name} <span className="text-[10px] font-bold uppercase tracking-wide text-faint">· patient</span></span>
          <span className="block truncate text-[11px] text-dim">{patient.id} · {patient.mobile}</span>
        </span>
        <ArrowDown2 size={16} variant="Linear" color="var(--color-teal-2)" className="flex-none" />
      </button>

      {/* 2. how to collect — charge card-on-file now, or text a pay link */}
      <div className="mx-5 mt-3 grid grid-cols-2 gap-1 rounded-[12px] border border-border bg-surface-2 p-1">
        {[{ k: false, label: "Charge now", icon: Card }, { k: true, label: "Send link", icon: Link21 }].map((m) => {
          const on = link === m.k;
          return (
            <button key={m.label} onClick={() => { haptic("select"); setLink(m.k); }} className="relative flex items-center justify-center gap-1.5 rounded-[9px] py-2.5">
              {on && <motion.span layoutId="collectpill" className="absolute inset-0 rounded-[9px] border border-teal/40 bg-teal/12" transition={{ type: "spring", stiffness: 420, damping: 38 }} />}
              <m.icon size={14} variant={on ? "Bulk" : "Linear"} color={on ? "var(--color-teal-2)" : "var(--color-dim)"} className="relative" />
              <span className={"relative text-[12.5px] font-semibold " + (on ? "text-ink" : "text-dim")}>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* pay-link is texted to the patient's mobile — make that explicit */}
      {link && (
        <div className="mx-5 mt-2 flex items-center gap-1.5 rounded-[9px] bg-teal/8 px-3 py-2 text-[11px] text-dim">
          <Message size={13} variant="Linear" color="var(--color-teal-2)" className="flex-none" />
          This link will be shared with <span className="font-semibold text-ink">{patient.mobile}</span>
        </div>
      )}

      {/* 3. program + tax as labeled dropdowns */}
      <div className="mx-5 mt-3 grid grid-cols-2 gap-2">
        <Dropdown label="Program / service" value={programs[prog]} onClick={() => { haptic("tap"); setSheet("program"); }} />
        <Dropdown label="Tax" value={tax.label} onClick={() => { haptic("tap"); setSheet("tax"); }} />
      </div>

      {/* amount + live fee breakdown */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{link ? <><Link21 size={13} variant="Linear" color="currentColor" />Request via link</> : <><Card size={13} variant="Linear" color="currentColor" />Charge card on file</>}</div>
        {(() => { const d = money(val).replace(".00", ""); const fs = d.length > 9 ? 38 : d.length > 7 ? 44 : 52; return (
          <div className="tnum mt-2 font-display font-semibold leading-none text-ink" style={{ fontSize: fs }}>{d}</div>
        ); })()}
        {val > 0 && taxAmt > 0 && (
          <div className="mt-2 text-[11px] text-dim">+ {money(taxAmt).replace(".00", "")} tax · total <span className="font-semibold text-ink">{money(total).replace(".00", "")}</span></div>
        )}
        {val > 0 && (
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-[11.5px] font-medium text-teal-2">
            <Flash size={13} variant="Bulk" color="currentColor" /> Net {money(net).replace(".00", "")} instantly · 2% fee
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
          {link ? `Send link${val > 0 ? " · " + money(total).replace(".00", "") : ""}` : `Charge ${val > 0 ? money(total).replace(".00", "") : "card"}`}
        </NeoPopButton>
      </div>

      {/* ---- patient sheet ---- */}
      <BottomSheet open={sheet === "patient"} onClose={close} title={adding ? "New patient" : "Select patient"} onBack={adding ? () => setAdding(false) : undefined}>
        {adding ? (
          <div className="space-y-3">
            <InputField label="Full name" value={nName} onChange={setNName} placeholder="e.g. Maria Gomez" prefix={<Profile size={16} variant="Linear" color="var(--color-faint)" />} />
            <InputField label="Mobile number" value={nMobile} onChange={setNMobile} placeholder="(512) 555-0123" type="tel" prefix={<Call size={16} variant="Linear" color="var(--color-faint)" />} hint="A secure Zeva Pay link is texted here when you send a request." />
            <NeoPopButton onClick={addPatient} className="w-full" faceClassName="px-5 py-3.5 text-[14.5px] font-semibold"><Add size={17} variant="Linear" color="currentColor" /> Add patient</NeoPopButton>
          </div>
        ) : (
          <div className="space-y-2">
            {patients.map((p) => {
              const on = p.id === ptId;
              return (
                <button key={p.id} onClick={() => { haptic("tap"); setPtId(p.id); close(); }} className={"flex w-full items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-surface-2 text-[13px] font-bold text-ink">{p.initials}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ink">{p.name}</span>
                    <span className="block truncate text-[11.5px] text-dim">{p.id} · {p.mobile}</span>
                  </span>
                  {on && <TickCircle size={18} variant="Bulk" color="var(--color-teal-2)" className="flex-none" />}
                </button>
              );
            })}
            <button onClick={() => { haptic("tap"); setAdding(true); }} className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-teal/40 bg-teal/5 p-3.5 text-left">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Add size={20} variant="Linear" color="currentColor" /></span>
              <span className="text-[13.5px] font-semibold text-teal-2">Add a new patient</span>
            </button>
          </div>
        )}
      </BottomSheet>

      {/* ---- program sheet ---- */}
      <BottomSheet open={sheet === "program"} onClose={close} title={adding ? "New program" : "Program / service"} onBack={adding ? () => setAdding(false) : undefined}>
        {adding ? (
          <div className="space-y-3">
            <InputField label="Program / service name" value={nProg} onChange={setNProg} placeholder="e.g. Vitamin IV drip" prefix={<ReceiptText size={16} variant="Linear" color="var(--color-faint)" />} />
            <NeoPopButton onClick={addProgram} className="w-full" faceClassName="px-5 py-3.5 text-[14.5px] font-semibold"><Add size={17} variant="Linear" color="currentColor" /> Add program</NeoPopButton>
          </div>
        ) : (
          <div className="space-y-2">
            {programs.map((p, i) => {
              const on = i === prog;
              return (
                <button key={p} onClick={() => { haptic("tap"); setProg(i); close(); }} className={"flex w-full items-center justify-between rounded-[12px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
                  <span className="truncate text-[14px] font-semibold text-ink">{p}</span>
                  {on && <TickCircle size={18} variant="Bulk" color="var(--color-teal-2)" className="flex-none" />}
                </button>
              );
            })}
            <button onClick={() => { haptic("tap"); setAdding(true); }} className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-teal/40 bg-teal/5 p-3.5 text-left">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Add size={18} variant="Linear" color="currentColor" /></span>
              <span className="text-[13.5px] font-semibold text-teal-2">Add a program / service</span>
            </button>
          </div>
        )}
      </BottomSheet>

      {/* ---- tax sheet ---- */}
      <BottomSheet open={sheet === "tax"} onClose={close} title={adding ? "Add a tax" : "Tax"} onBack={adding ? () => setAdding(false) : undefined}>
        {adding ? (
          <div className="space-y-3">
            <InputField label="Tax name" value={nTaxLabel} onChange={setNTaxLabel} placeholder="e.g. County tax" prefix={<ReceiptText size={16} variant="Linear" color="var(--color-faint)" />} />
            <InputField label="Rate" value={nTaxRate} onChange={(v) => setNTaxRate(v.replace(/[^\d.]/g, ""))} placeholder="8.25" type="tel" prefix={<span className="text-[13px] font-semibold text-faint">%</span>} hint="Applied on top of the amount you enter." />
            <NeoPopButton onClick={addTax} className="w-full" faceClassName="px-5 py-3.5 text-[14.5px] font-semibold"><Add size={17} variant="Linear" color="currentColor" /> Add tax</NeoPopButton>
          </div>
        ) : (
          <div className="space-y-2">
            {taxes.map((t, i) => {
              const on = i === taxIdx;
              return (
                <button key={t.id} onClick={() => { haptic("tap"); setTaxIdx(i); close(); }} className={"flex w-full items-center justify-between rounded-[12px] border p-3.5 text-left transition-colors " + (on ? "border-teal bg-teal/8" : "border-border bg-surface")}>
                  <span className="truncate text-[14px] font-semibold text-ink">{t.label}</span>
                  {on && <TickCircle size={18} variant="Bulk" color="var(--color-teal-2)" className="flex-none" />}
                </button>
              );
            })}
            <button onClick={() => { haptic("tap"); setAdding(true); }} className="flex w-full items-center gap-3 rounded-[12px] border border-dashed border-teal/40 bg-teal/5 p-3.5 text-left">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal/12 text-teal-2"><Add size={18} variant="Linear" color="currentColor" /></span>
              <span className="text-[13.5px] font-semibold text-teal-2">Add a custom tax</span>
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
