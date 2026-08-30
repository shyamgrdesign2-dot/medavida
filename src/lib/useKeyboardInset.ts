import { useEffect, useState } from "react";

/**
 * Height (px) currently covered by the on-screen keyboard, via visualViewport.
 * 0 when no keyboard. Lets a bottom CTA lift itself to sit just above the keys
 * on real mobile (no effect inside the desktop device mock, which is fine).
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onChange = () => {
      const covered = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset(covered > 80 ? covered : 0); // ignore small URL-bar jitters
    };
    vv.addEventListener("resize", onChange);
    vv.addEventListener("scroll", onChange);
    onChange();
    return () => {
      vv.removeEventListener("resize", onChange);
      vv.removeEventListener("scroll", onChange);
    };
  }, []);
  return inset;
}
