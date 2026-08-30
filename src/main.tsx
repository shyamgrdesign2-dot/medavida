import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { initTheme } from "./lib/theme";

// Apply the saved light/dark preference before first paint.
initTheme();

// No StrictMode: this is an animation-heavy prototype and the double-mount
// interferes with one-shot splash/entrance timelines.
createRoot(document.getElementById("root")!).render(<App />);
