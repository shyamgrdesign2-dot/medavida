import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LightRays } from "@/components/backgrounds/LightRays";
import { NeoPopButton } from "@/components/NeoPopButton";
import { ZevaMark } from "@/components/ZevaMark";
import { APP_NAME } from "@/lib/brand";
import { haptic } from "@/lib/haptics";
import { useKeyboardInset } from "@/lib/useKeyboardInset";

const fmt = (d: string) => {
  const n = d.replace(/\D/g, "").slice(0, 10);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `(${n.slice(0, 3)}) ${n.slice(3)}`;
  return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
};

export function SignIn({ onDone }: { onDone: () => void; onCreate?: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = phone.replace(/\D/g, "");
  const kb = useKeyboardInset();

  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 350);
  }, [step]);

  const setOtpAt = (i: number, v: string) => {
    const ds = v.replace(/\D/g, "");
    haptic("tap");
    if (ds.length > 1) {
      // paste or fast type — distribute across boxes
      setOtp((o) => { const n = [...o]; for (let k = 0; k < ds.length && i + k < 6; k++) n[i + k] = ds[k]; return n; });
      otpRefs.current[Math.min(i + ds.length, 5)]?.focus();
      return;
    }
    const d = ds.slice(-1);
    setOtp((o) => { const n = [...o]; n[i] = d; return n; });
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const otpFull = otp.every((d) => d !== "");

  useEffect(() => {
    if (step === "otp" && otpFull && !verifying) {
      setVerifying(true);
      haptic("success");
      setTimeout(onDone, 1100);
    }
  }, [otpFull, step, verifying, onDone]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <AnimatedBackground variant="css" intensity={0.5} />
      <LightRays raysOrigin="top-center" raysColor="#23FFED" raysSpeed={0.7} lightSpread={0.9} rayLength={1.9} followMouse={false} className="opacity-70" />

      <div className="relative z-10 flex flex-none items-center gap-2.5 px-6 pt-5">
        {step === "otp" && (
          <button onClick={() => { haptic("tap"); setStep("phone"); }} className="mr-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-ink">
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
        )}
        <ZevaMark size={30} tone="teal" />
        <span className="font-display text-[21px] font-semibold lowercase tracking-tight text-ink">{APP_NAME}</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
              <h1 className="font-display text-[27px] font-semibold leading-tight tracking-tight text-ink">Enter your<br />phone number</h1>
              <p className="mt-2 text-[13px] text-dim">We'll text you a 6-digit code to sign in.</p>
              <div className="mt-6 flex items-center gap-2.5 rounded-[10px] border border-border bg-surface-2 px-3.5 py-3.5 focus-within:border-teal">
                <span className="flex flex-none items-center gap-1.5 whitespace-nowrap font-mono text-[16px] font-medium text-ink"><span className="text-[18px] leading-none">🇺🇸</span> +1</span>
                <span className="h-5 w-px flex-none bg-border" />
                <input
                  autoFocus
                  inputMode="tel"
                  value={fmt(phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 012-3456"
                  className="w-full bg-transparent font-mono text-[16px] font-medium tracking-wide text-ink placeholder:text-faint focus:outline-none"
                />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-faint">By continuing you agree to Zeva's Terms and Privacy Policy. Message &amp; data rates may apply.</p>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>
              {verifying ? (
                <div className="flex flex-col items-center">
                  <motion.div className="flex h-16 w-16 items-center justify-center rounded-full bg-go/15 text-go" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                    <Check size={32} strokeWidth={3} />
                  </motion.div>
                  <div className="mt-4 font-display text-[20px] font-semibold text-ink">Verified</div>
                  <div className="mt-1 text-[12.5px] text-dim">Signing you in…</div>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-[27px] font-semibold leading-tight tracking-tight text-ink">Enter the code</h1>
                  <p className="mt-2 text-[13px] text-dim">Sent to +1 {fmt(phone)}</p>
                  <div className="mt-6 flex justify-between gap-2">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        inputMode="numeric"
                        value={d}
                        onChange={(e) => setOtpAt(i, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                        className={"h-14 w-full rounded-[10px] border bg-surface-2 text-center font-mono text-[22px] font-bold text-ink focus:outline-none " + (d ? "border-teal" : "border-border")}
                      />
                    ))}
                  </div>
                  <button className="mt-5 text-[12.5px] font-semibold text-teal-2">Resend code</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!verifying && (
        <motion.div
          className="relative z-10 flex-none px-6"
          animate={{ paddingBottom: kb ? kb + 14 : 32 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
          {step === "phone" ? (
            <NeoPopButton onClick={() => { if (digits.length === 10) { haptic("tap"); setStep("otp"); } }} className="w-full" faceClassName={"px-5 py-4 text-[15px] font-medium " + (digits.length === 10 ? "" : "opacity-50")}>
              Send code <ChevronRight size={18} strokeWidth={2.2} />
            </NeoPopButton>
          ) : (
            <div className="text-center text-[11px] text-faint">Enter the code to continue</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
