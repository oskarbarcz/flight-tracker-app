import React, { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CABIN_FILLS, CABIN_ORDER, CABIN_SHORT_LABELS } from "~/features/cabin-layout/components/SeatMap/cabinLevels";
import { SeatTooltip } from "~/features/cabin-layout/components/SeatMap/SeatTooltip";
import { type CabinSection, cabinFrame, fuselagePath } from "~/features/cabin-layout/lib/cabinFrame";
import type { CabinClass, CabinSeat, CabinSeatMapDeck } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  deck: CabinSeatMapDeck;
  basis: number;
  minScale: number;
};

const CAPS_CHAR_PX = 9;
const MONO_CHAR_PX = 6.5;
const LETTER_MIN_GAP_PX = 6;
const OPEN_DELAY_MS = 180;
const TOOLTIP_CLEARANCE_PX = 150;
const SEPARATOR_MARGIN_PX = 3;

type Hover = {
  seat: CabinSeat;
  x: number;
  y: number;
  below: boolean;
};

function rowRange(section: CabinSection): string {
  return section.firstRow === section.lastRow ? section.firstRow : `${section.firstRow}–${section.lastRow}`;
}

function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (node === null) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function CabinDiagram({ deck, basis, minScale }: Props) {
  const frame = useMemo(() => cabinFrame(deck), [deck]);
  const { ref, width } = useMeasuredWidth();
  const openTimer = useRef<number | null>(null);
  const [popup, setPopup] = useState<Hover | null>(null);

  const seatsByDesignator = useMemo(() => new Map(deck.seats.map((seat) => [seat.designator, seat])), [deck.seats]);

  useEffect(() => {
    const dismiss = () => setPopup(null);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current);
      }
    };
  }, []);

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-seat]");
    if (target === null) {
      return;
    }

    const seat = seatsByDesignator.get(target.dataset.seat ?? "");
    if (seat === undefined || popup?.seat.designator === seat.designator) {
      return;
    }

    const seatRect = target.getBoundingClientRect();
    const below = seatRect.top < TOOLTIP_CLEARANCE_PX;
    const next: Hover = {
      seat,
      x: seatRect.left + seatRect.width / 2,
      y: below ? seatRect.bottom : seatRect.top,
      below,
    };

    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
    }
    openTimer.current = window.setTimeout(() => setPopup(next), OPEN_DELAY_MS);
  }

  function clearPointer() {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
    }
    setPopup(null);
  }

  const present = useMemo(() => {
    const seen = new Set<CabinClass>(deck.seats.map((seat) => seat.cabin));
    return CABIN_ORDER.filter((cabin) => seen.has(cabin));
  }, [deck.seats]);

  if (frame === null) {
    return null;
  }

  const along = (value: number) => (value / frame.length) * 100;
  const across = (value: number) => ((frame.acrossOrigin + frame.width - value) / frame.width) * 100;
  const share = frame.length / basis;
  const basisWidth = Math.max(width, basis * minScale);
  const diagramWidth = basisWidth * share;
  const diagramHeight = (diagramWidth * frame.width) / frame.length;

  const separatorInset = diagramWidth > 0 ? (SEPARATOR_MARGIN_PX * frame.length) / diagramWidth : 0;

  const fits = (span: number, label: string, charWidth: number) =>
    (diagramWidth * span) / frame.length >= label.length * charWidth;

  const spacedLetters = (section: CabinSection) => {
    const placed = section.letters
      .map((entry) => ({
        entry,
        top: ((frame.acrossOrigin + frame.width - entry.across) / frame.width) * diagramHeight,
      }))
      .sort((left, right) => left.top - right.top);

    const visible: typeof section.letters = [];
    let last = Number.NEGATIVE_INFINITY;
    for (const { entry, top } of placed) {
      if (top - last < LETTER_MIN_GAP_PX) {
        continue;
      }
      last = top;
      visible.push(entry);
    }
    return visible;
  };

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative">
        <div ref={ref} className="overflow-x-auto">
          <div className="mx-auto" style={{ width: `${diagramWidth}px` }}>
            <div className="relative mb-2 h-4">
              {frame.sections.map((section) =>
                fits(section.contentLength, CABIN_SHORT_LABELS[section.cabin], CAPS_CHAR_PX) ? (
                  <span
                    key={`${section.firstRow}-head`}
                    style={{ left: `${along(section.contentStart)}%`, width: `${along(section.contentLength)}%` }}
                    className="absolute truncate text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    {CABIN_SHORT_LABELS[section.cabin]}
                  </span>
                ) : null,
              )}
            </div>

            <div
              role="img"
              aria-label={`Cabin diagram: ${deck.seatCount} seats across ${frame.rowCount} rows`}
              className="relative"
              style={{ aspectRatio: `${frame.length} / ${frame.width}` }}
              onPointerMove={trackPointer}
              onPointerLeave={clearPointer}
            >
              <svg
                viewBox={`0 0 ${frame.length} ${frame.width}`}
                preserveAspectRatio="none"
                aria-hidden={true}
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d={fuselagePath(frame)}
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={1}
                  className="fill-gray-50 stroke-gray-300 dark:fill-gray-800/40 dark:stroke-gray-600"
                />
                {frame.sections.slice(1).map((section) => (
                  <line
                    key={`${section.firstRow}-divider`}
                    x1={section.gutterStart + separatorInset}
                    x2={section.gutterStart + separatorInset}
                    y1={0}
                    y2={frame.width}
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={1}
                    className="stroke-gray-300 dark:stroke-gray-600"
                  />
                ))}
              </svg>

              {frame.sections.map((section) =>
                spacedLetters(section).map(({ letter, across: centre }) => (
                  <span
                    key={`${section.firstRow}-${letter}`}
                    style={{ left: `${along(section.gutterStart + frame.gutter / 2)}%`, top: `${across(centre)}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-gray-400 dark:text-gray-500"
                  >
                    {letter}
                  </span>
                )),
              )}

              {frame.sections.map((section) =>
                section.seats.map((seat) => (
                  <span
                    key={seat.designator}
                    data-seat={seat.designator}
                    style={{
                      left: `${along(section.contentStart + (seat.y - section.sourceStart))}%`,
                      top: `${across(seat.x + seat.width)}%`,
                      width: `${along(seat.height)}%`,
                      height: `${(seat.width / frame.width) * 100}%`,
                      rotate: seat.rotation === 0 ? undefined : `${seat.rotation}deg`,
                    }}
                    className={twMerge(
                      "absolute rounded-[2px] border border-gray-900/10 transition-[scale,box-shadow] duration-[90ms] ease-out hover:z-10 hover:scale-[1.45] hover:ring-1 hover:ring-gray-900 motion-reduce:transition-none dark:border-white/10 dark:hover:ring-white",
                      CABIN_FILLS[seat.cabin],
                    )}
                  />
                )),
              )}
            </div>

            <div className="relative mt-2 h-4">
              {frame.sections.map((section) =>
                fits(section.contentLength, rowRange(section), MONO_CHAR_PX) ? (
                  <span
                    key={`${section.firstRow}-rows`}
                    style={{ left: `${along(section.contentStart)}%`, width: `${along(section.contentLength)}%` }}
                    className="absolute truncate font-mono text-[10px] text-gray-400 dark:text-gray-500"
                  >
                    {rowRange(section)}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        </div>
        {popup && <SeatTooltip {...popup} />}
      </div>

      <figcaption className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {present.map((cabin) => (
          <span key={cabin} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span
              className={twMerge(
                "size-2.5 rounded-xs border border-gray-900/10 dark:border-white/10",
                CABIN_FILLS[cabin],
              )}
            />
            {toHuman.cabinLayout.cabinClass(cabin)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
