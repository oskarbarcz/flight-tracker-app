import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TooltipRow } from "~/features/cabin-layout/components/SeatMap/TooltipRow";
import type { PositionAppearance } from "~/features/cargo-hold/lib/holdReading";
import { acceptedTypes } from "~/features/cargo-hold/lib/positionFit";
import type { HoldPosition } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  position: HoldPosition;
  appearance?: PositionAppearance;
  x: number;
  y: number;
  below: boolean;
};

const FALLBACK_HALF_WIDTH = 90;
const VIEWPORT_MARGIN = 8;
const ARROW_INSET = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function HoldPositionTooltip({ position, appearance, x, y, below }: Props) {
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
  const fits = acceptedTypes(position);

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
        <p className="mb-1.5 font-mono text-xs font-bold text-white">{position.designator}</p>
        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-xs">
          <TooltipRow label="Side" value={toHuman.cargoHold.positionSide(position.side)} />
          <TooltipRow label="Compartment" value={position.compartment} />
          <TooltipRow label="Max weight" value={`${position.maxWeightKg.toLocaleString()} kg`} />
          <TooltipRow label="Bases" value={position.acceptedBases.join(", ")} />
          <TooltipRow label="Contours" value={position.acceptedContours.join(", ")} />
          <TooltipRow label="Accepts" value={fits.length === 0 ? "No catalogued device" : fits.join(", ")} />
          {appearance?.detail?.map((row) => (
            <TooltipRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
        {appearance?.markers !== undefined && appearance.markers.length > 0 && (
          <ul className="mt-1.5 flex flex-col gap-0.5 border-t border-gray-700 pt-1.5 dark:border-gray-600">
            {appearance.markers.map((marker) => (
              <li key={marker.key} className="flex items-center gap-1.5 text-xs text-gray-300">
                <marker.icon aria-hidden={true} className="size-3 shrink-0" />
                {marker.label}
              </li>
            ))}
          </ul>
        )}
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
