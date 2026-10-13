import type { CSSProperties, ReactNode } from "react";

/**
 * Above-the-fold entrances are plain CSS (see .rise / .line-rise in globals.css):
 * they start with the first paint instead of waiting for JavaScript to hydrate,
 * which matters most on slow phones.
 */
export function LineRise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <span className={`line-rise ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

export function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`rise ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
