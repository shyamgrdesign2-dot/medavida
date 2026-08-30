import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { startGyro } from "./lib/gyro";
import { PhoneFrame } from "./components/PhoneFrame";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { SignIn } from "./screens/SignIn";
import { AccountCreate } from "./screens/AccountCreate";
import { AppShell } from "./app/AppShell";

type Screen = "splash" | "onboarding" | "signin" | "account" | "app";

// Dev harness: ?screen=onboarding jumps straight there; ?hold=1 freezes the
// splash so it can be inspected. Keeps verification deterministic.
const params = new URLSearchParams(location.search);
const initial = (params.get("screen") as Screen) || "splash";
const hold = params.get("hold") === "1";

export function App() {
  const [screen, setScreen] = useState<Screen>(initial);

  // Request motion access on the very first tap anywhere (iOS needs a gesture),
  // then the shared gyro stream drives every card + the logo mark.
  useEffect(() => {
    const kick = () => { void startGyro(); };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, []);

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div key="splash" className="h-full" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Splash hold={hold} onDone={() => setScreen("onboarding")} />
          </motion.div>
        )}
        {screen === "onboarding" && (
          <motion.div key="onboarding" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Onboarding onStart={() => setScreen("signin")} onSignin={() => setScreen("signin")} />
          </motion.div>
        )}
        {screen === "signin" && (
          <motion.div key="signin" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <SignIn onDone={() => setScreen("app")} />
          </motion.div>
        )}
        {/* Sign-up flow is built but hidden for now — reachable only via ?screen=account.
            To re-enable: route Onboarding onStart to "account", pass
            onCreate={() => setScreen("account")} to SignIn, and restore the
            "Create an account" link in SignIn + the "Sign in" link in Onboarding. */}
        {screen === "account" && (
          <motion.div key="account" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <AccountCreate onDone={() => setScreen("app")} onSignin={() => setScreen("signin")} />
          </motion.div>
        )}
        {screen === "app" && (
          <motion.div key="app" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <AppShell />
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
