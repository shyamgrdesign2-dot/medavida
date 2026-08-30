import { useSyncExternalStore } from "react";

export type ThemePref = "system" | "light" | "dark";
const KEY = "zeva-theme";
const subs = new Set<() => void>();

function read(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch { /* ignore */ }
  return "dark"; // default: everyone opens in dark, regardless of system setting
}

/** Reflect the preference onto <html data-theme>. "system" clears the attribute. */
function reflect(pref: ThemePref) {
  const root = document.documentElement;
  // suppress the cross-page transition smear during the swap (better-ui)
  root.classList.add("theme-swapping");
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
  // force a reflow, then restore transitions next frame
  void root.offsetWidth;
  requestAnimationFrame(() => root.classList.remove("theme-swapping"));
}

export function setThemePref(pref: ThemePref) {
  try { localStorage.setItem(KEY, pref); } catch { /* ignore */ }
  reflect(pref);
  subs.forEach((f) => f());
}

/** Call once at startup to apply the saved preference. */
export function initTheme() {
  reflect(read());
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => { subs.delete(f); }; },
    read,
    () => "dark" as ThemePref,
  );
}
