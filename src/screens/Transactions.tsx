import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronLeft, Check } from "lucide-react";
import { TxnRow, Chip, Icon } from "@/components/ui";
import { BottomSheet } from "@/components/BottomSheet";
import { TXNS, money, type Txn } from "@/lib/data";
import { haptic } from "@/lib/haptics";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
  { id: "patient", label: "Patients" },
  { id: "supplier", label: "Suppliers" },
  { id: "bills", label: "Bills" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

const matches = (t: Txn, f: FilterId) =>
  f === "all" ? true :
  f === "in" ? t.dir === "in" :
  f === "out" ? t.dir === "out" :
  f === "bills" ? ["utility", "rent", "loan"].includes(t.category) :
  t.category === f;

export function Transactions({ onBack }: { onBack?: () => void }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Txn | null>(null);

  const list = useMemo(
    () => TXNS.filter((t) => matches(t, filter) && (q === "" || (t.title + t.sub).toLowerCase().includes(q.toLowerCase()))),
    [filter, q]
  );

  return (
    <div className="no-scrollbar h-full overflow-y-auto pb-28">
      {/* header */}
      <div className="sticky top-0 z-10 bg-bg/80 px-5 pb-2 pt-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={() => { haptic("tap"); onBack(); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink">
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
          )}
          <div className="font-display text-[22px] font-semibold tracking-tight text-ink">Activity</div>
        </div>

        {/* search */}
        <div className="mt-3 flex items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2.5">
          <Search size={16} strokeWidth={2} className="text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patient ID, vendor, medication"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-faint focus:outline-none"
          />
        </div>

        {/* filter chips */}
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => { haptic("tap"); setFilter(f.id); }}
                className={"flex-none rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors " + (on ? "bg-teal text-on-teal" : "border border-border bg-surface text-dim")}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* list */}
      <div className="mx-5 mt-2 rounded-[12px] border border-border bg-surface px-3.5">
        {list.length === 0 && <div className="py-10 text-center text-[13px] text-dim">No transactions match.</div>}
        {list.map((t, i) => (
          <div key={t.id} className={i > 0 ? "border-t border-border-soft" : ""}>
            <TxnRow
              category={t.category}
              title={t.title}
              sub={`${t.sub} · ${t.when}`}
              amount={money(t.amount)}
              dir={t.dir}
              onClick={() => { haptic("tap"); setSel(t); }}
              chip={
                t.status === "instant" ? <Chip tone="pos">Instant</Chip> :
                t.status === "approval" ? <Chip tone="warn">Needs approval</Chip> :
                undefined
              }
            />
          </div>
        ))}
      </div>

      {/* detail sheet */}
      <BottomSheet open={!!sel} onClose={() => setSel(null)} title={sel?.title}>
        {sel && (
          <div>
            <div className="flex flex-col items-center py-2">
              <span className={"flex h-14 w-14 items-center justify-center rounded-[10px] " + (sel.dir === "in" ? "bg-go/12 text-go" : "bg-surface-2 text-ink")}>
                <Icon name={sel.icon} size={24} />
              </span>
              <div className={"tnum mt-3 font-display text-[32px] font-semibold " + (sel.dir === "in" ? "text-go" : "text-ink")}>
                {sel.dir === "in" ? "+" : "−"}{money(sel.amount)}
              </div>
              <div className="text-[12px] text-dim">{sel.sub}</div>
              {sel.status === "instant" && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-go/15 px-3 py-1 text-[11px] font-bold text-go">
                  <Check size={13} strokeWidth={2.4} /> Settled instantly
                </div>
              )}
            </div>

            <div className="mt-3 divide-y divide-border-soft rounded-[12px] border border-border bg-surface-2 px-4">
              <Row k="Date" v={/AM|PM/.test(sel.when) ? `Aug 30, 2026 · ${sel.when}` : sel.when === "Yesterday" ? "Aug 29, 2026" : `${sel.when}, 2026`} />
              {sel.category === "patient" && <Row k="Patient ID" v={sel.title.replace("Patient · ", "")} mono />}
              {sel.category === "patient" && <Row k="Medication" v={sel.sub} />}
              <Row k="Category" v={cap(sel.category)} />
              <Row k="Card" v="Operating •• 5528" mono />
              <Row k="Status" v={sel.dir === "in" ? "Disbursed" : "Completed"} />
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[12px] text-dim">{k}</span>
      <span className={"text-[12.5px] font-semibold text-ink " + (mono ? "font-mono" : "")}>{v}</span>
    </div>
  );
}
