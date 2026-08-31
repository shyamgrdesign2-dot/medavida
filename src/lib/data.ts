// =========================================================================
// Zeva demo data — a US clinic. USD everywhere.
// Inflow = patient card-on-file payments (patient ID + medication in memo).
// Outflow = suppliers, payroll, rent, utilities via the Zeva card.
// =========================================================================

export const CLINIC = {
  name: "Shyam GR Clinic",
  short: "Shyam GR",
  city: "Austin, TX",
  operatingBalance: 128450.2,
  owner: "Dr. Shyam GR",
};

export type CardType = "debit" | "virtual" | "credit";

export interface ZCard {
  id: string;
  label: string;
  scope: string;
  type: CardType;
  last4: string;
  holder: string;
  exp: string;
  /** visual variant */
  variant: "teal" | "graphite" | "credit";
  balanceLabel: string;
  balance: number;
}

export const CARDS: ZCard[] = [
  {
    id: "operating",
    label: "Operating",
    scope: "All clinic spend",
    type: "debit",
    last4: "5528",
    holder: "MERIDIAN FUNCTIONAL",
    exp: "08/29",
    variant: "teal",
    balanceLabel: "Available",
    balance: 128450.2,
  },
  {
    id: "credit",
    label: "Zeva Credit",
    scope: "Instant limit · 1.5% back",
    type: "credit",
    last4: "8802",
    holder: "MERIDIAN FUNCTIONAL",
    exp: "11/30",
    variant: "credit",
    balanceLabel: "Available credit",
    balance: 42000.0,
  },
];

export type Direction = "in" | "out";
export interface Txn {
  id: string;
  title: string;
  sub: string;
  amount: number;
  dir: Direction;
  when: string;
  category: "patient" | "supplier" | "payroll" | "rent" | "utility" | "loan" | "fee";
  icon: string; // lucide name
  status?: "settled" | "instant" | "pending" | "approval";
}

export const TXNS: Txn[] = [
  { id: "t1", title: "Patient · SGR-2831", sub: "Semaglutide 0.5mg · visit", amount: 340.0, dir: "in", when: "9:24 AM", category: "patient", icon: "HeartPulse", status: "instant" },
  { id: "t2", title: "Patient · SGR-2830", sub: "GLP-1 program · month 2", amount: 499.0, dir: "in", when: "9:02 AM", category: "patient", icon: "HeartPulse", status: "instant" },
  { id: "t3", title: "Fullscript", sub: "Supplement order #FS-9921", amount: 1240.5, dir: "out", when: "Yesterday", category: "supplier", icon: "Pill", status: "settled" },
  { id: "t4", title: "Patient · SGR-2822", sub: "Lab panel · Rupa Health", amount: 285.0, dir: "in", when: "Yesterday", category: "patient", icon: "HeartPulse", status: "instant" },
  { id: "t5", title: "City of Austin Utilities", sub: "Electricity · autopay", amount: 412.6, dir: "out", when: "Aug 27", category: "utility", icon: "Zap", status: "settled" },
  { id: "t6", title: "Payroll · 4 staff", sub: "Semi-monthly run", amount: 9820.0, dir: "out", when: "Aug 25", category: "payroll", icon: "Users", status: "settled" },
  { id: "t7", title: "McKesson Medical", sub: "Compounding invoice #4471", amount: 3850.0, dir: "out", when: "Aug 24", category: "supplier", icon: "Truck", status: "approval" },
  { id: "t8", title: "Suite 4B — Rent", sub: "Downtown Wellness Suite LLC", amount: 6200.0, dir: "out", when: "Aug 22", category: "rent", icon: "Building2", status: "settled" },
];

export const money = (n: number, sign = false) => {
  const s = n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  return sign ? (n >= 0 ? `+${s}` : s) : s;
};
export const money0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// ---- Bill Pay ----
export type BillStatus = "upcoming" | "autopay" | "scheduled" | "approval" | "paid";
export interface Bill {
  id: string;
  name: string;
  sub: string;
  icon: string; // lucide name in the ICONS map
  amount: number;
  due: string;
  status: BillStatus;
}
export const BILLS: Bill[] = [
  { id: "rent", name: "Downtown Wellness Suite", sub: "Rent · Suite 4B", icon: "Building2", amount: 6200, due: "Due Sep 1", status: "upcoming" },
  { id: "power", name: "City of Austin", sub: "Electricity · autopay 5th", icon: "Zap", amount: 412.6, due: "Due Sep 5", status: "autopay" },
  { id: "vendor", name: "McKesson Medical", sub: "Vendor invoice #4471", icon: "Truck", amount: 3850, due: "Due Sep 10", status: "approval" },
  { id: "internet", name: "Google Fiber", sub: "Internet · biz 1-gig", icon: "Wifi", amount: 89, due: "Due Sep 12", status: "scheduled" },
  { id: "loan", name: "Diagnostic Analyzer", sub: "Equipment loan", icon: "FileText", amount: 1120, due: "Due Sep 5", status: "scheduled" },
];
