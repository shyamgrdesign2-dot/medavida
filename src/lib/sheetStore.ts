import { useSyncExternalStore } from "react";

/**
 * Tiny global gate: how many bottom sheets / modal overlays are currently open.
 * The floating nav subscribes and hides itself while anything is open, so the
 * persistent tab bar never fights a sheet for the bottom of the screen.
 */
let count = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const sheetStore = {
  open() { count += 1; emit(); },
  close() { count = Math.max(0, count - 1); emit(); },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
  snapshot: () => count > 0,
};

export function useAnySheetOpen() {
  return useSyncExternalStore(sheetStore.subscribe, sheetStore.snapshot, sheetStore.snapshot);
}
