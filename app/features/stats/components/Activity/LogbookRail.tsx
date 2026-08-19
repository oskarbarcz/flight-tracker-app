import React, { useRef, useState } from "react";
import { dateAtFraction, fractionOf, type Rail } from "~/features/stats/lib/rail";
import type { Span } from "~/features/stats/lib/span";
import { formatDuration } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  rail: Rail;
  span: Span;
  isCustom: boolean;
  onPick: (date: Date) => void;
  onRange: (from: Date, to: Date) => void;
  onStep: (direction: -1 | 1) => void;
};

type Drag = { mode: "move" | "from" | "to"; grabOffset: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EDGE_GRAB_PX = 10;

function percent(value: number): string {
  return `${(value * 100).toFixed(3)}%`;
}

export function LogbookRail({ rail, span, isCustom, onPick, onRange, onStep }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const windowStart = fractionOf(span.from, rail.from, rail.to);
  const windowEnd = fractionOf(span.to, rail.from, rail.to);
  const windowWidth = Math.max(0.004, windowEnd - windowStart);

  function fractionFromEvent(event: React.PointerEvent | PointerEvent): number {
    const track = trackRef.current;
    if (track === null) {
      return 0;
    }
    const box = track.getBoundingClientRect();
    return Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
  }

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (track === null) {
      return;
    }

    const box = track.getBoundingClientRect();
    const fraction = fractionFromEvent(event);
    const startPx = windowStart * box.width;
    const endPx = windowEnd * box.width;
    const atPx = fraction * box.width;

    let mode: Drag["mode"] = "move";
    if (isCustom && Math.abs(atPx - startPx) <= EDGE_GRAB_PX) {
      mode = "from";
    } else if (isCustom && Math.abs(atPx - endPx) <= EDGE_GRAB_PX) {
      mode = "to";
    }

    dragRef.current = { mode, grabOffset: fraction - windowStart };
    applyDrag(fraction, mode, fraction - windowStart);

    try {
      track.setPointerCapture(event.pointerId);
    } catch {
      dragRef.current = null;
    }
  }

  function applyDrag(fraction: number, mode: Drag["mode"], grabOffset: number) {
    if (mode === "from") {
      const next = dateAtFraction(fraction, rail.from, rail.to);
      if (next < span.to) {
        onRange(next, span.to);
      }
      return;
    }

    if (mode === "to") {
      const next = dateAtFraction(fraction, rail.from, rail.to);
      if (next > span.from) {
        onRange(span.from, next);
      }
      return;
    }

    if (isCustom) {
      const width = windowEnd - windowStart;
      const start = Math.min(1 - width, Math.max(0, fraction - grabOffset));
      onRange(dateAtFraction(start, rail.from, rail.to), dateAtFraction(start + width, rail.from, rail.to));
      return;
    }

    onPick(dateAtFraction(fraction, rail.from, rail.to));
  }

  function continueDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag === null) {
      return;
    }
    applyDrag(fractionFromEvent(event), drag.mode, drag.grabOffset);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    dragRef.current = null;

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  }

  const hoveredMonth = rail.months.find((month) => month.key === hovered);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>Logbook</FieldLabel>
        <span className="font-mono text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
          {hoveredMonth
            ? `${MONTHS[hoveredMonth.start.getUTCMonth()]} ${hoveredMonth.start.getUTCFullYear()} · ${formatDuration(hoveredMonth.blockMinutes)}`
            : `${MONTHS[rail.from.getUTCMonth()]} ${rail.from.getUTCFullYear()} → ${MONTHS[rail.to.getUTCMonth()]} ${rail.to.getUTCFullYear()}`}
        </span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Logbook timeline"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(windowStart * 100)}
        aria-valuetext={span.label}
        tabIndex={0}
        onPointerDown={beginDrag}
        onPointerMove={continueDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setHovered(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onStep(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            onStep(1);
          }
        }}
        className="relative h-12 w-full cursor-ew-resize touch-none select-none rounded-lg bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-gray-950"
      >
        {rail.years.map((year) => (
          <span
            key={year.year}
            aria-hidden={true}
            className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"
            style={{ left: percent(year.fraction) }}
          />
        ))}

        <span
          aria-hidden={true}
          className="absolute inset-y-0 rounded-md border-x-2 border-indigo-500 bg-indigo-500/12 transition-[left,width] duration-300 ease-out motion-reduce:transition-none dark:border-indigo-400 dark:bg-indigo-400/15"
          style={{ left: percent(windowStart), width: percent(windowWidth) }}
        >
          {isCustom && (
            <>
              <span className="absolute -left-[3px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
              <span className="absolute -right-[3px] top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            </>
          )}
        </span>

        {rail.months.map((month) => {
          const left = fractionOf(month.start, rail.from, rail.to);
          const right = fractionOf(month.end, rail.from, rail.to);
          const height = rail.peakBlockMinutes > 0 ? month.blockMinutes / rail.peakBlockMinutes : 0;
          const inWindow = month.end >= span.from && month.start <= span.to;

          return (
            <span
              key={month.key}
              aria-hidden={true}
              onPointerEnter={() => setHovered(month.key)}
              className="absolute bottom-0 flex items-end justify-center px-px pb-[3px]"
              style={{ left: percent(left), width: percent(Math.max(0.002, right - left)), top: 0 }}
            >
              <span
                className={`w-full max-w-2.5 rounded-t-[2px] ${
                  month.blockMinutes === 0
                    ? "bg-gray-300 dark:bg-gray-600"
                    : inWindow
                      ? "bg-indigo-500 dark:bg-indigo-400"
                      : "bg-gray-400 dark:bg-gray-500"
                }`}
                style={{ height: month.blockMinutes === 0 ? "2px" : `${Math.max(8, height * 80)}%` }}
              />
            </span>
          );
        })}

        <span aria-hidden={true} className="absolute inset-x-0 bottom-[3px] h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="relative h-3">
        {rail.years.map((year) => (
          <span
            key={year.year}
            className="absolute font-mono text-[11px] tabular-nums text-gray-400 dark:text-gray-500"
            style={{ left: percent(year.fraction) }}
          >
            {year.year}
          </span>
        ))}
      </div>
    </div>
  );
}
