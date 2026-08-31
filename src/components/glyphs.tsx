// Custom Bulk-style glyphs for concepts iconsax doesn't ship (injection, pill).
// Same call shape as iconsax icons — { size, color, variant } — so they drop into
// the existing icon maps. `variant` is accepted and ignored (always filled/Bulk).
type GlyphProps = { size?: number; color?: string; variant?: string; className?: string };

/** Syringe / injection — for GLP-1 and injectable programs. */
export function Injection({ size = 24, color = "currentColor", className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <g transform="rotate(-45 12 12)">
        {/* needle */}
        <rect x="2.2" y="11.2" width="4.3" height="1.6" rx="0.8" fill={color} />
        {/* barrel (light Bulk fill) */}
        <rect x="6" y="8.4" width="9.2" height="7.2" rx="2.2" fill={color} opacity="0.4" />
        {/* barrel gradations */}
        <rect x="8.6" y="8.4" width="1.2" height="7.2" fill={color} opacity="0.9" />
        <rect x="11.2" y="8.4" width="1.2" height="7.2" fill={color} opacity="0.9" />
        {/* flange + plunger head */}
        <rect x="14.7" y="9.2" width="2" height="5.6" rx="1" fill={color} />
        <rect x="16.6" y="10.7" width="5.2" height="2.6" rx="1.3" fill={color} />
      </g>
    </svg>
  );
}

/** Snowflake — for "freeze card". iconsax has no snowflake. */
export function Snowflake({ size = 24, color = "currentColor", className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <g stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.33 2 12 5.33" />
        <path d="M8.67 22 12 18.67" />
        <path d="M15.33 22 12 18.67V5.33L8.67 2" />
        <path d="M2 8.67 5.33 12" />
        <path d="M2 15.33 5.33 12h13.33l3.33-3.33" />
        <path d="M22 15.33 18.67 12" />
        <path opacity="0.4" d="M18.67 5.33 5.34 18.66" />
        <path opacity="0.4" d="M5.33 5.33 18.66 18.66" />
      </g>
    </svg>
  );
}

/** Generic card-network mark (interlocking discs) — stands in for Visa/Mastercard
    without reproducing a real brand logo. */
export function CardNetwork({ size = 24, color = "currentColor", className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="12" r="6" fill={color} opacity="0.45" />
      <circle cx="15" cy="12" r="6" fill={color} opacity="0.85" />
    </svg>
  );
}

/** Capsule / pill — for supplements & Rx. */
export function Pill({ size = 24, color = "currentColor", className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <g transform="rotate(-45 12 12)">
        {/* capsule body (light half) */}
        <rect x="3.5" y="8.4" width="17" height="7.2" rx="3.6" fill={color} opacity="0.4" />
        {/* solid half + seam */}
        <path d="M12 8.4h4.9a3.6 3.6 0 0 1 0 7.2H12z" fill={color} />
        <rect x="11.4" y="8.4" width="1.2" height="7.2" fill={color} opacity="0.85" />
      </g>
    </svg>
  );
}
