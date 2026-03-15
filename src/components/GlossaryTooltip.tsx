import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { GlossaryEntry } from "../data/glossary";

interface GlossaryTooltipProps {
  entry: GlossaryEntry;
  children: React.ReactNode;
}

export function GlossaryTooltip({ entry, children }: GlossaryTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, above: true });
  const spanRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const above = rect.top > 200;
    // Clamp x so tooltip stays within viewport (assume ~360px max width)
    const halfWidth = 180;
    const margin = 8;
    const x = Math.max(halfWidth + margin, Math.min(rect.left + rect.width / 2, window.innerWidth - halfWidth - margin));
    setPos({
      x,
      y: above ? rect.top - 8 : rect.bottom + 8,
      above,
    });
  }, []);

  // Desktop hover
  const handleMouseEnter = useCallback(() => {
    updatePosition();
    setShow(true);
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    setShow(false);
  }, []);

  // Touch/tap toggle
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") {
        e.preventDefault();
        e.stopPropagation();
        updatePosition();
        setShow((s) => !s);
      }
    },
    [updatePosition]
  );

  // Dismiss on outside tap
  useEffect(() => {
    if (!show) return;
    const handler = (e: PointerEvent) => {
      if (
        spanRef.current &&
        !spanRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [show]);

  return (
    <>
      <span
        ref={spanRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        className="border-b border-dotted border-stone-400 dark:border-stone-500 cursor-help"
      >
        {children}
      </span>
      {show &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: `${pos.x}px`,
              top: pos.above ? `${pos.y}px` : `${pos.y}px`,
              transform: pos.above
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
              zIndex: 50,
              maxWidth: "min(360px, 90vw)",
            }}
            className="rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-sm shadow-lg dark:border-stone-600 dark:bg-stone-800"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {entry.term}
              </span>
              {entry.abbr && (
                <span className="rounded bg-accent-600 px-1.5 py-0.5 text-xs font-mono text-white">
                  {entry.abbr}
                </span>
              )}
              {entry.ruleRef && (
                <span className="text-xs font-mono text-accent-700 dark:text-accent-400">
                  §{entry.ruleRef}
                </span>
              )}
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-snug">
              {entry.definition}
            </p>
          </div>,
          document.body
        )}
    </>
  );
}
