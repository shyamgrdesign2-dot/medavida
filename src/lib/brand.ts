// =========================================================================
// Zeva brand — single source of truth. Change APP_NAME here to rebrand.
// =========================================================================
export const APP_NAME = "Zeva";
export const APP_TAGLINE = "Banking, built for functional medicine clinics";
export const APP_PARENT = "MedaVida";

// palette (mirrors CSS tokens for use in canvas/SVG/JS where vars are awkward)
export const C = {
  bg: "#0a0b0d",
  surface: "#131418",
  surface2: "#1a1c21",
  surface3: "#23262c",
  border: "#26292f",
  ink: "#f5f6f5",
  dim: "#9a9ea4",
  faint: "#63676d",
  teal: "#23ffed",
  teal2: "#0fd8c8",
  tealDeep: "#06504a",
  onTeal: "#04231f",
  go: "#2fd07a",
  caution: "#f7b955",
  stop: "#ff5c5c",
} as const;

// motion primitives shared across screens
export const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 } as const;
export const springSoft = { type: "spring", stiffness: 240, damping: 30 } as const;
export const easeOut = [0.22, 1, 0.36, 1] as const;
