import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
            <Onboarding onStart={() => setScreen("account")} onSignin={() => setScreen("signin")} />
          </motion.div>
        )}
        {screen === "signin" && (
          <motion.div key="signin" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <SignIn onDone={() => setScreen("app")} onCreate={() => setScreen("account")} />
          </motion.div>
        )}
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
