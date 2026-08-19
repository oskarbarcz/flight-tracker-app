import React, { useLayoutEffect, useRef, useState } from "react";
import { formatDayDate, type HeatmapDay } from "~/features/stats/lib/heatmap";
import { formatDuration } from "~/shared/lib/time";

type Props = {
  day: HeatmapDay;
  centre: number;
  y: number;
  frameWidth: number;
};

const FALLBACK_HALF_WIDTH = 60;
const EDGE_OVERSHOOT = 10;
const ARROW_INSET = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function HeatmapTooltip({ day, centre, y, frameWidth }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(FALLBACK_HALF_WIDTH);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card !== null) {
      setHalfWidth(card.getBoundingClientRect().width / 2);
    }
  }, []);

  const x = clamp(centre, halfWidth - EDGE_OVERSHOOT, frameWidth - halfWidth + EDGE_OVERSHOOT);
  const arrowLimit = Math.max(0, halfWidth - ARROW_INSET);
  const arrowOffset = clamp(centre - x, -arrowLimit, arrowLimit);
  return (
    <div
      role="tooltip"
      style={{ transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)` }}
      className="pointer-events-none absolute left-0 top-0 z-20 pb-2"
    >
      <div
        ref={cardRef}
        className="relative origin-bottom animate-in fade-in zoom-in-95 rounded-lg bg-gray-900 px-3 py-2 shadow-lg duration-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none dark:bg-gray-700"
      >
        <span className="block whitespace-nowrap font-mono text-xs font-bold text-white">
          {formatDayDate(day.date)}
        </span>

        {day.isFuture ? (
          <span className="mt-0.5 block whitespace-nowrap text-xs text-gray-300">No scheduled flights</span>
        ) : day.totals.flights === 0 ? (
          <span className="mt-0.5 block whitespace-nowrap text-xs text-gray-300">No flights</span>
        ) : (
          <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3 text-xs">
            <dt className="text-gray-400">Flights</dt>
            <dd className="text-end font-mono tabular-nums text-white">{day.totals.flights}</dd>
            <dt className="text-gray-400">Block</dt>
            <dd className="text-end font-mono tabular-nums text-white">{formatDuration(day.totals.blockMinutes)}</dd>
            <dt className="text-gray-400">Air</dt>
            <dd className="text-end font-mono tabular-nums text-white">{formatDuration(day.totals.airborneMinutes)}</dd>
          </dl>
        )}

        <span
          aria-hidden={true}
          style={{ left: `calc(50% + ${arrowOffset}px)` }}
          className="absolute -bottom-1 size-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-gray-900 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
