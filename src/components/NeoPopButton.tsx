import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

/**
 * Authentic CRED NeoPop plunk button: a flat face with two skewed edge blocks
 * (bottom + right) forming a boxy 3D extrusion; the face plunks down-right on
 * press. Sharp corners by design. Label is medium weight, not bold.
 */
export function NeoPopButton({
  children,
  variant = "primary",
  depth = 6,
  className,
  faceClassName = "px-5 py-4 text-[15px] font-medium",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "dark";
  depth?: number;
  faceClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{ ["--e" as any]: `${depth}px`, ...props.style }}
      className={clsx("np", variant === "primary" ? "np-primary" : "np-dark", className)}
    >
      <span className={clsx("np-face", faceClassName)}>{children}</span>
      <span className="np-edge bottom" />
      <span className="np-edge right" />
    </button>
  );
}
