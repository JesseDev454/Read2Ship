import { useCallback, useEffect, useMemo, useState } from "react";

export interface TourStep {
  target: string;
  title: string;
  body: string;
}

interface OnboardingTourProps {
  id: string;
  steps: TourStep[];
}

interface TargetBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const STORAGE_PREFIX = "read2ship-tour-complete";

export function OnboardingTour({ id, steps }: OnboardingTourProps) {
  const storageKey = `${STORAGE_PREFIX}:${id}`;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetBox, setTargetBox] = useState<TargetBox | null>(null);

  const activeStep = steps[activeIndex];

  useEffect(() => {
    if (!steps.length) return;
    if (window.localStorage.getItem(storageKey) === "true") return;
    setIsOpen(true);
  }, [steps.length, storageKey]);

  const findStepTarget = useCallback(
    (startIndex: number) => {
      for (let offset = 0; offset < steps.length; offset += 1) {
        const index = (startIndex + offset) % steps.length;
        const target = document.querySelector<HTMLElement>(
          `[data-tour="${steps[index].target}"]`
        );
        if (target) {
          return { index, target };
        }
      }

      return null;
    },
    [steps]
  );

  const updatePosition = useCallback(() => {
    if (!isOpen || !steps.length) return;

    const resolved = findStepTarget(activeIndex);
    if (!resolved) {
      setIsOpen(false);
      return;
    }

    if (resolved.index !== activeIndex) {
      setActiveIndex(resolved.index);
      return;
    }

    resolved.target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    const rect = resolved.target.getBoundingClientRect();
    setTargetBox({
      top: Math.max(10, rect.top - 8),
      left: Math.max(10, rect.left - 8),
      width: rect.width + 16,
      height: rect.height + 16,
    });
  }, [activeIndex, findStepTarget, isOpen, steps.length]);

  useEffect(() => {
    updatePosition();

    if (!isOpen) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  function completeTour() {
    window.localStorage.setItem(storageKey, "true");
    setIsOpen(false);
  }

  function goToNext() {
    if (activeIndex >= steps.length - 1) {
      completeTour();
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  function goToPrevious() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  const tooltipStyle = useMemo(() => {
    if (!targetBox) return {};

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = Math.min(340, viewportWidth - 32);
    const preferredLeft = targetBox.left + targetBox.width + 16;
    const left =
      preferredLeft + tooltipWidth <= viewportWidth - 16
        ? preferredLeft
        : Math.min(Math.max(16, targetBox.left), viewportWidth - tooltipWidth - 16);

    const belowTop = targetBox.top + targetBox.height + 16;
    const top =
      belowTop + 210 <= viewportHeight
        ? belowTop
        : Math.max(16, Math.min(targetBox.top - 210, viewportHeight - 226));

    return { left, top, width: tooltipWidth };
  }, [targetBox]);

  if (!isOpen || !activeStep || !targetBox) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none">
      <div
        className="fixed rounded-xl border border-secondary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.68),0_0_30px_rgba(6,182,212,0.35)] transition-all duration-300"
        style={targetBox}
        aria-hidden="true"
      />
      <section
        className="pointer-events-auto fixed rounded-lg border border-white/10 bg-surface-panel p-4 shadow-2xl shadow-black/60"
        style={tooltipStyle}
        role="dialog"
        aria-live="polite"
        aria-label={activeStep.title}
      >
        <div className="label-code mb-2 text-secondary">
          {activeIndex + 1} of {steps.length}
        </div>
        <h2 className="text-base font-semibold text-white">{activeStep.title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{activeStep.body}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className="text-xs font-semibold text-text-tertiary transition hover:text-white"
            onClick={completeTour}
          >
            Skip
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="min-h-9 rounded-lg border border-white/10 px-3 text-xs font-semibold text-text-secondary transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              onClick={goToPrevious}
              disabled={activeIndex === 0}
            >
              Back
            </button>
            <button
              type="button"
              className="min-h-9 rounded-lg border border-primary/70 bg-primary px-4 text-xs font-semibold text-white shadow-glow transition hover:bg-purple-500"
              onClick={goToNext}
            >
              {activeIndex === steps.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
