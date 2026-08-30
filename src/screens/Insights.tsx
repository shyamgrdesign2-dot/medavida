import { useState } from "react";
import { motion } from "motion/react";
import { MoneyRecive, MoneySend, TrendUp, Wallet, Profile2User, Activity, type Icon as IconsaxIcon } from "iconsax-react";
import { Squircle } from "@/lib/squircle";
import { AnimatedGradient } from "@/components/AnimatedGradient";
import { money, money0 } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const PERIODS = ["This month", "Quarter", "Year"];
const MULT = [1, 3.1, 11.8];
const DELTA = [14, 9, 22]; // growth vs prior period, per filter
const LABELS = [
  ["W1", "W2", "W3", "W4", "W5"],
  ["Apr", "May", "Jun", "Jul", "Aug"],
  ["Q1", "Q2", "Q3", "Q4", "YTD"],
];
const CASH = [
  { in: 31, out: 24 }, { in: 35, out: 22 }, { in: 29, out: 26 }, { in: 42, out: 28 }, { in: 38.2, out: 26.6 },
];
const MAX = 46;

const CATS = [
  { name: "Suppliers & Rx", value: 12400, color: "var(--acc-teal)" },
  { name: "Payroll", value: 9820, color: "var(--acc-mint)" },
  { name: "Rent", value: 6200, color: "var(--acc-blue)" },
  { name: "Labs (Rupa)", value: 1850, color: "var(--acc-green)" },
  { name: "Utilities", value: 980, color: "var(--acc-amber)" },
];
const CAT_TOTAL = CATS.reduce((s, c) => s + c.value, 0);

const PROGRAMS = [
  { name: "GLP-1 program", value: 18540, color: "var(--acc-teal)" },
  { name: "Peptide therapy", value: 6200, color: "var(--acc-blue)" },
  { name: "Labs & panels", value: 3900, color: "var(--acc-green)" },
  { name: "Consults", value: 2100, color: "var(--acc-amber)" },
];
const PROG_MAX = Math.max(...PROGRAMS.map((p) => p.value));

function Donut() {
  const r = 52, C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative h-[124px] w-[124px] flex-none">
      <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth="13" />
        {CATS.map((c) => {
          const frac = c.value / CAT_TOTAL;
          const seg = <circle key={c.name} cx="66" cy="66" r={r} fill="none" stroke={c.color} strokeWidth="13" strokeLinecap="round" strokeDasharray={`${frac * C - 4} ${C}`} style={{ strokeDashoffset: -acc * C }} />;
          acc += frac;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Spent</div>
        <div className="tnum font-display text-[18px] font-semibold text-ink">{money0(CAT_TOTAL)}</div>
      </div>
    </div>
  );
}

export function Insights() {
  const [p, setP] = useState(0);
  const m = MULT[p];
  const collected = 38240 * m, spent = 26612 * m, net = collected - spent;

  const KPIS: { icon: IconsaxIcon; tint: string; label: string; value: string }[] = [
    { icon: MoneyRecive, tint: "var(--acc-green)", label: "Collected", value: money0(collected) },
    { icon: MoneySend, tint: "var(--acc-slate)", label: "Spent", value: money0(spent) },
    { icon: Wallet, tint: "var(--acc-teal)", label: "Net", value: money0(net) },
    { icon: Activity, tint: "var(--acc-blue)", label: "Avg / visit", value: money0(312) },
  ];

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-5 pb-28 pt-4">
      <div className="font-display text-[22px] font-semibold tracking-tight text-ink">Insights</div>
      <div className="text-[12px] text-dim">How your clinic's money moves</div>

      {/* period filter */}
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        {PERIODS.map((label, i) => (
          <button key={label} onClick={() => { haptic("tap"); setP(i); }} className={"flex-none rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors " + (p === i ? "bg-teal text-on-teal" : "border border-border bg-surface text-dim")}>{label}</button>
        ))}
      </div>

      {/* KPI grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {KPIS.map((k) => (
          <Squircle key={k.label} radius={13} className="border border-border bg-surface p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-dim"><k.icon size={14} variant="Bulk" color={k.tint} />{k.label}</div>
            <div className="tnum mt-1 text-[18px] font-bold text-ink">{k.value}</div>
          </Squircle>
        ))}
      </div>

      {/* net cashflow narrative */}
      <Squircle radius={16} className="relative mt-3 overflow-hidden border border-border bg-surface p-4">
        <AnimatedGradient tone="teal" opacity={0.6} />
        <div className="relative flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint"><TrendUp size={14} variant="Bulk" color="currentColor" />Net cashflow · {PERIODS[p].toLowerCase()}</div>
        <div className="tnum relative mt-1 font-display text-[28px] font-semibold text-go">+{money0(net)}</div>
        <div className="relative mt-1 text-[11.5px] text-dim">Up <span className="font-semibold text-go">{DELTA[p]}%</span> vs the prior {p === 0 ? "month" : p === 1 ? "quarter" : "year"}</div>
      </Squircle>

      {/* cashflow chart */}
      <Squircle radius={16} className="mt-3 border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Money in vs out</div>
          <div className="flex items-center gap-3 text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-go"><span className="h-2 w-2 rounded-full bg-go" />In</span>
            <span className="flex items-center gap-1 text-dim"><span className="h-2 w-2 rounded-full bg-surface-3" />Out</span>
          </div>
        </div>
        <div className="flex items-end gap-2.5">
          {CASH.map((mo, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[104px] w-full items-end justify-center gap-[3px]">
                <motion.div className="w-[45%] rounded-t-[4px] bg-go" initial={{ height: 0 }} animate={{ height: `${Math.max(6, (mo.in / MAX) * 100)}%` }} transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 220, damping: 26 }} />
                <motion.div className="w-[45%] rounded-t-[4px] bg-surface-3" initial={{ height: 0 }} animate={{ height: `${Math.max(6, (mo.out / MAX) * 100)}%` }} transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 220, damping: 26 }} />
              </div>
              <span className="text-[9px] font-semibold text-faint">{LABELS[p][i]}</span>
            </div>
          ))}
        </div>
      </Squircle>

      {/* revenue by program — new metric */}
      <Squircle radius={16} className="mt-3 border border-border bg-surface p-4">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Revenue by program</div>
        <div className="space-y-2.5">
          {PROGRAMS.map((pr, i) => (
            <div key={pr.name}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink">{pr.name}</span>
                <span className="tnum font-semibold text-ink">{money0(pr.value * m)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <motion.div className="h-full rounded-full" style={{ background: pr.color }} initial={{ width: 0 }} animate={{ width: `${(pr.value / PROG_MAX) * 100}%` }} transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 200, damping: 30 }} />
              </div>
            </div>
          ))}
        </div>
      </Squircle>

      {/* spend donut + legend */}
      <Squircle radius={16} className="mt-3 border border-border bg-surface p-4">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-faint">Where it went</div>
        <div className="flex items-center gap-4">
          <Donut />
          <div className="min-w-0 flex-1">
            {CATS.map((c) => (
              <button key={c.name} onClick={() => haptic("tap")} className="flex w-full items-center gap-2 py-1.5">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: c.color }} />
                <span className="flex-1 truncate text-left text-[12px] font-medium text-ink">{c.name}</span>
                <span className="tnum text-[12px] font-bold text-ink">{money0(c.value)}</span>
                <span className="tnum w-8 text-right text-[11px] font-semibold text-faint">{Math.round((c.value / CAT_TOTAL) * 100)}%</span>
              </button>
            ))}
          </div>
        </div>
      </Squircle>

      {/* insight callouts */}
      <Squircle radius={16} className="mt-3 flex items-center gap-3 border border-teal/20 bg-teal/8 p-4">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-teal/15"><Profile2User size={19} variant="Bulk" color="var(--color-teal-2)" /></span>
        <div className="text-[12.5px] leading-snug text-ink">Patient revenue is up <span className="font-bold text-teal-2">14%</span> — driven by the GLP-1 program (42 new patients).</div>
      </Squircle>
    </div>
  );
}
