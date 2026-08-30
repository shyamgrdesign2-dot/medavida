import { ReactNode, useEffect, useState } from "react";

/**
 * Device shell for the desktop preview only. On a real phone (narrow viewport)
 * it renders full-bleed — no fake bezel/status bar — so the app fills the
 * screen like a native app.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const [bare, setBare] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 520 : false));
  useEffect(() => {
    const onResize = () => setBare(window.innerWidth <= 520);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- real mobile: full-bleed, no chrome ----
  if (bare) {
    return (
      <div
        className="no-scrollbar relative flex h-[100dvh] w-full flex-col overflow-hidden bg-bg"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {children}
      </div>
    );
  }

  // ---- desktop preview: device mockup ----
  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-bg py-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(35,255,237,0.10), transparent 55%), radial-gradient(90% 60% at 80% 110%, rgba(15,216,200,0.08), transparent 60%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0" />

      <div
        className="relative flex flex-col overflow-hidden bg-bg"
        style={{
          width: 390, height: 844, maxHeight: "calc(100dvh - 24px)", aspectRatio: "390 / 844",
          borderRadius: 54, border: "11px solid #050506",
          boxShadow: "0 40px 90px -30px rgba(0,0,0,0.85), 0 0 0 1px #2a2c31, inset 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-black" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)" }} />
        <div className="relative z-20 flex flex-shrink-0 items-center justify-between px-7 pt-4 pb-1 text-[13px] font-medium text-ink">
          <span className="tnum tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0.5" y="7" width="2.5" height="4.5" rx="1" fill="currentColor" />
              <rect x="4.2" y="5" width="2.5" height="6.5" rx="1" fill="currentColor" />
              <rect x="7.9" y="2.6" width="2.5" height="8.9" rx="1" fill="currentColor" />
              <rect x="11.6" y="0.5" width="2.5" height="11" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 2.2C10 2.2 11.9 3 13.3 4.4l1.2-1.2C12.8 1.5 10.5.6 8 .6S3.2 1.5 1.5 3.2l1.2 1.2C4.1 3 6 2.2 8 2.2z" fill="currentColor" />
              <path d="M8 5.4c1.1 0 2.2.4 3 1.2l1.2-1.2C11 4.3 9.6 3.8 8 3.8s-3 .5-4.2 1.6L5 6.6c.8-.8 1.9-1.2 3-1.2z" fill="currentColor" />
              <circle cx="8" cy="9.2" r="1.7" fill="currentColor" />
            </svg>
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="2" width="17" height="8" rx="1.6" fill="currentColor" />
              <rect x="23" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
        </div>

        <div className="no-scrollbar relative z-10 flex flex-1 flex-col overflow-hidden">{children}</div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 w-[130px] -translate-x-1/2 rounded-full bg-ink/25" />
      </div>
    </div>
  );
}
