import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabBar, type Tab } from "@/components/TabBar";
import { AppBackground } from "@/components/AppBackground";
import { Home } from "@/screens/Home";
import { Cards } from "@/screens/Cards";
import { Transactions } from "@/screens/Transactions";
import { BillPay } from "@/screens/BillPay";
import { Insights } from "@/screens/Insights";
import { More } from "@/screens/More";
import { MoveMoney } from "@/screens/MoveMoney";
import { CollectPayment } from "@/screens/CollectPayment";
import { Approvals } from "@/screens/Approvals";
import { TrustSecurity } from "@/screens/TrustSecurity";
import { Settlement } from "@/screens/Settlement";
import { Memberships } from "@/screens/Memberships";
import { Invoices } from "@/screens/Invoices";
import { StaffRoles } from "@/screens/StaffRoles";
import { Reserves } from "@/screens/Reserves";
import { Receipts } from "@/screens/Receipts";
import { AccountingExport } from "@/screens/AccountingExport";
import { Vendors1099 } from "@/screens/Vendors1099";

type Overlay = null | "transactions" | "send" | "add" | "move" | "collect" | "approvals" | "trust" | "settlement" | "memberships" | "invoices" | "staff" | "reserves" | "receipts" | "accounting" | "vendors";

export function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [overlay, setOverlay] = useState<Overlay>(null);

  const onSeeAll = useCallback(() => setOverlay("transactions"), []);
  const onQuick = useCallback((k: string) => {
    if (k === "cards") setTab("cards");
    else if (k === "bills") setTab("pay");
    else if (k === "insights") setTab("insights");
    else if (k === "more") setTab("more");
    else if (k === "send") setOverlay("send");
    else if (k === "add") setOverlay("add");
    else if (k === "collect") setOverlay("collect");
    else if (k === "approvals") setOverlay("approvals");
    else if (k === "trust") setOverlay("trust");
    else if (k === "settlement") setOverlay("settlement");
    else if (k === "memberships") setOverlay("memberships");
    else if (k === "invoices") setOverlay("invoices");
    else if (k === "staff") setOverlay("staff");
    else if (k === "reserves") setOverlay("reserves");
    else if (k === "receipts") setOverlay("receipts");
    else if (k === "accounting") setOverlay("accounting");
    else if (k === "vendors") setOverlay("vendors");
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      <AppBackground />
      {/* Everything the app renders shares ONE promoted GPU layer. This keeps the
          text-repaint fix (translateZ) while keeping bottom sheets (z-50) above
          the nav (z-40): they're now siblings in the same stacking context. */}
      <div className="relative h-full" style={{ transform: "translateZ(0)" }}>
        {/* keyed swap so screens cross-fade — each screen keeps its own promoted
            layer so text always repaints (the modal sheets it contains are still
            usable because the nav hides itself whenever a sheet opens). */}
        <div key={tab} className="h-full" style={{ transform: "translateZ(0)" }}>
          {tab === "home" && <Home onSeeAll={onSeeAll} onOpenTxn={onSeeAll} onQuick={onQuick} />}
          {tab === "cards" && <Cards />}
          {tab === "pay" && <BillPay />}
          {tab === "insights" && <Insights />}
          {tab === "more" && <More onOpen={onQuick} />}
        </div>

        <TabBar active={tab} onChange={setTab} />

      {/* pushed overlays (slide from right, cover the nav) */}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key={overlay}
            className="absolute inset-0 z-50 bg-bg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 40 }}
          >
            {overlay === "transactions" && <Transactions onBack={() => setOverlay(null)} />}
            {overlay === "collect" && <CollectPayment onBack={() => setOverlay(null)} />}
            {overlay === "approvals" && <Approvals onBack={() => setOverlay(null)} />}
            {overlay === "trust" && <TrustSecurity onBack={() => setOverlay(null)} />}
            {overlay === "settlement" && <Settlement onBack={() => setOverlay(null)} />}
            {overlay === "memberships" && <Memberships onBack={() => setOverlay(null)} />}
            {overlay === "invoices" && <Invoices onBack={() => setOverlay(null)} />}
            {overlay === "staff" && <StaffRoles onBack={() => setOverlay(null)} />}
            {overlay === "reserves" && <Reserves onBack={() => setOverlay(null)} />}
            {overlay === "receipts" && <Receipts onBack={() => setOverlay(null)} />}
            {overlay === "accounting" && <AccountingExport onBack={() => setOverlay(null)} />}
            {overlay === "vendors" && <Vendors1099 onBack={() => setOverlay(null)} />}
            {(overlay === "send" || overlay === "add" || overlay === "move") && (
              <MoveMoney mode={overlay} onBack={() => setOverlay(null)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
