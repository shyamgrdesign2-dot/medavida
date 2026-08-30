import { CSSProperties, ReactNode } from "react";

/**
 * Rounded surface. (Previously used a measured clip-path squircle, but that
 * intermittently clipped content to nothing on heavy screens — reverted to a
 * plain border-radius box for reliability. Keeps the same API.)
 */
export function Squircle({
  radius = 10,
  smoothing: _smoothing,
  className,
  style,
  children,
  ...rest
}: {
  radius?: number;
  smoothing?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} style={{ borderRadius: radius, boxShadow: "var(--shadow-card)", ...style }} {...rest}>
      {children}
    </div>
  );
}
