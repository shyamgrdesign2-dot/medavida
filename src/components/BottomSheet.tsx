import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, X } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { sheetStore } from "@/lib/sheetStore";

/**
 * Slide-up bottom sheet with scrim + drag-to-dismiss.
 * - `onBack` renders an accordion back-arrow inline in the header (no wasteful
 *   standalone Back row inside the body).
 * - `size="tall"` gives a fixed ~68% height so multi-step flows feel roomy and
 *   don't jump between steps; content scrolls inside. Default hugs its content.
 */
export function BottomSheet({ open, onClose, children, title, onBack, size = "auto" }: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  onBack?: () => void;
  size?: "auto" | "tall";
}) {
  useEffect(() => {
    if (!open) return;
    sheetStore.open();
    return () => sheetStore.close();
  }, [open]);

  const tall = size === "tall";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="absolute inset-0 backdrop-blur-[2px]" style={{ background: "var(--scrim)" }} onClick={() => { haptic("tap"); onClose(); }} />
          <motion.div
            className={
              "relative z-10 flex flex-col overflow-hidden rounded-t-[20px] border-t border-border bg-surface " +
              (tall ? "h-[68%]" : "max-h-[88%]")
            }
            style={{ boxShadow: "0 -20px 50px -12px rgba(0,0,0,0.7)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 500) { haptic("tap"); onClose(); } }}
          >
            {/* grab handle */}
            <div className="flex flex-none justify-center pt-3"><div className="h-1 w-10 rounded-full bg-ink/20" /></div>

            {/* header: inline back arrow (accordion) + title + close */}
            {(title || onBack) && (
              <div className="flex flex-none items-center gap-2 px-4 pb-1 pt-2.5">
                {onBack ? (
                  <motion.button
                    onClick={() => { haptic("tap"); onBack(); }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Back"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-surface-2 text-ink"
                  >
                    <ChevronLeft size={17} strokeWidth={2.4} />
                  </motion.button>
                ) : (
                  <span className="w-1" />
                )}
                {title && <div className="flex-1 truncate font-display text-[17px] font-semibold text-ink">{title}</div>}
                <motion.button
                  onClick={() => { haptic("tap"); onClose(); }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-surface-2 text-dim"
                >
                  <X size={15} strokeWidth={2.4} />
                </motion.button>
              </div>
            )}

            <div className={"no-scrollbar overflow-y-auto px-5 pb-8 pt-3 " + (tall ? "flex-1" : "max-h-[76vh]")}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
