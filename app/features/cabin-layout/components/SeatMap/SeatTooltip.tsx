import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CabinSeat } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  seat: CabinSeat;
  x: number;
  y: number;
  below: boolean;
  children: React.ReactNode;
};

const FALLBACK_HALF_WIDTH = 70;
const VIEWPORT_MARGIN = 8;
const ARROW_INSET = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function SeatTooltip({ seat, x, y, below, children }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(FALLBACK_HALF_WIDTH);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card !== null) {
      setHalfWidth(card.getBoundingClientRect().width / 2);
    }
  }, []);

  const lower = halfWidth + VIEWPORT_MARGIN;
  const upper = Math.max(window.innerWidth - halfWidth - VIEWPORT_MARGIN, lower);
  const anchor = clamp(x, lower, upper);
  const arrowLimit = Math.max(0, halfWidth - ARROW_INSET);
  const arrowOffset = clamp(x - anchor, -arrowLimit, arrowLimit);

  return createPortal(
    <div
      role="tooltip"
      style={{ transform: `translate3d(${anchor}px, ${y}px, 0) translate(-50%, ${below ? "0" : "-100%"})` }}
      className={`pointer-events-none fixed left-0 top-0 z-50 ${below ? "pt-2" : "pb-2"}`}
    >
      <div
        ref={cardRef}
        className={`relative animate-in fade-in zoom-in-95 rounded-lg bg-gray-900 px-3 py-2 shadow-lg duration-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none dark:bg-gray-700 ${below ? "origin-top" : "origin-bottom"}`}
      >
        <span className="block whitespace-nowrap text-xs text-gray-300">
          <span className="font-mono font-bold text-white">{seat.designator}</span>
          {`, ${toHuman.cabinLayout.cabinClass(seat.cabin)}`}
        </span>

        {children}

        <span
          aria-hidden={true}
          style={{ left: `calc(50% + ${arrowOffset}px)` }}
          className={`absolute size-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-gray-900 dark:bg-gray-700 ${below ? "-top-1" : "-bottom-1"}`}
        />
      </div>
    </div>,
    document.body,
  );
}
