import React, { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Seat } from "~/features/cabin-layout/components/SeatMap/Seat";
import { SeatFacts } from "~/features/cabin-layout/components/SeatMap/SeatFacts";
import { SeatTooltip } from "~/features/cabin-layout/components/SeatMap/SeatTooltip";
import { type CabinFrame, type CabinSection, cabinFrame, fuselagePath } from "~/features/cabin-layout/lib/cabinFrame";
import {
  CABIN_SHORT_LABELS,
  CONDITION_LABELS,
  type SeatAppearance,
  type SeatMode,
  seatCondition,
} from "~/features/cabin-layout/lib/seatAppearance";
import { orderedSeats } from "~/features/cabin-layout/lib/seatOrder";
import type { CabinClass, CabinSeat, CabinSeatMapDeck } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  deck: CabinSeatMapDeck;
  basis: number;
  minScale: number;
  mode: SeatMode;
  spotlit?: CabinClass | null;
  describedBy?: string;
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

function diagramWidthOf(frame: CabinFrame, basis: number, minScale: number, measured: number): number {
  return Math.max(measured, basis * minScale) * (frame.length / basis);
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

export function CabinDiagram({ deck, basis, minScale, mode, spotlit = null, describedBy }: Props) {
  const frame = useMemo(() => cabinFrame(deck), [deck]);
  const { ref, width } = useMeasuredWidth();
  const openTimer = useRef<number | null>(null);
  const scrolledTo = useRef<number | null>(null);
  const [popup, setPopup] = useState<Hover | null>(null);

  const seatsByDesignator = useMemo(() => new Map(deck.seats.map((seat) => [seat.designator, seat])), [deck.seats]);

  const placements = useMemo(() => {
    if (frame === null) {
      return [];
    }

    const sections = new Map<string, CabinSection>();
    for (const section of frame.sections) {
      for (const seat of section.seats) {
        sections.set(seat.designator, section);
      }
    }

    const along = (value: number) => (value / frame.length) * 100;
    const across = (value: number) => ((frame.acrossOrigin + frame.width - value) / frame.width) * 100;

    return orderedSeats(deck).flatMap((seat) => {
      const section = sections.get(seat.designator);
      if (section === undefined) {
        return [];
      }

      const appearance = mode.resolve(seat, deck.deck);

      return [
        {
          seat,
          appearance,
          condition: seatCondition(seat),
          description: seatDescription(seat, appearance),
          style: {
            left: `${along(section.contentStart + (seat.y - section.sourceStart))}%`,
            top: `${across(seat.x + seat.width)}%`,
            width: `${along(seat.height)}%`,
            height: `${(seat.width / frame.width) * 100}%`,
            rotate: seat.rotation === 0 ? undefined : `${seat.rotation}deg`,
          } as React.CSSProperties,
        },
      ];
    });
  }, [deck, frame, mode]);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest("[data-seat]") == null) {
        setPopup(null);
      }
    };
    window.addEventListener("pointerdown", dismissOutside);
    return () => window.removeEventListener("pointerdown", dismissOutside);
  }, []);

  useEffect(() => {
    const dismiss = () => setPopup(null);
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPopup(null);
      }
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("keydown", dismissOnEscape);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("keydown", dismissOnEscape);
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const scroller = ref.current;
    if (scroller === null || frame === null || spotlit === null || width === 0) {
      return;
    }

    const section = frame.sections.find((entry) => entry.cabin === spotlit);
    if (section === undefined) {
      return;
    }

    const total = diagramWidthOf(frame, basis, minScale, width);
    const start = (section.gutterStart / frame.length) * total;
    const end = ((section.contentStart + section.contentLength) / frame.length) * total;
    const target = Math.max(0, Math.min((start + end) / 2 - width / 2, total - width));

    if (scrolledTo.current === target) {
      return;
    }
    scrolledTo.current = target;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ left: target, behavior: still ? "auto" : "smooth" });
  }, [spotlit, frame, basis, minScale, width, ref]);

  function openFor(target: HTMLElement, immediate: boolean) {
    const seat = seatsByDesignator.get(target.dataset.seat ?? "");
    if (seat === undefined) {
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

    if (immediate) {
      setPopup(next);
      return;
    }
    openTimer.current = window.setTimeout(() => setPopup(next), OPEN_DELAY_MS);
  }

  function seatUnder(event: React.SyntheticEvent): HTMLElement | null {
    return (event.target as HTMLElement).closest<HTMLElement>("[data-seat]");
  }

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    const target = seatUnder(event);
    if (target === null || popup?.seat.designator === target.dataset.seat) {
      return;
    }
    openFor(target, false);
  }

  function tapSeat(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      return;
    }
    const target = seatUnder(event);
    if (target === null) {
      return;
    }
    if (popup?.seat.designator === target.dataset.seat) {
      clearPointer();
      return;
    }
    openFor(target, true);
  }

  function focusSeat(event: React.FocusEvent<HTMLDivElement>) {
    const target = seatUnder(event);
    if (target !== null) {
      openFor(target, true);
    }
  }

  function leavePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      clearPointer();
    }
  }

  function clearPointer() {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
    }
    setPopup(null);
  }

  if (frame === null) {
    return null;
  }

  const along = (value: number) => (value / frame.length) * 100;
  const across = (value: number) => ((frame.acrossOrigin + frame.width - value) / frame.width) * 100;
  const diagramWidth = diagramWidthOf(frame, basis, minScale, width);
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
    <figure aria-describedby={describedBy} className="flex flex-col">
      <figcaption className="sr-only">
        {`Schematic cabin diagram of the ${toHuman.cabinLayout.deck(deck.deck)}: ${deck.seatCount} seats across ${frame.rowCount} rows, nose to the left.`}
      </figcaption>
      <div className="relative">
        <div ref={ref} className="overflow-x-auto">
          <div className="mx-auto" style={{ width: `${diagramWidth}px` }}>
            <div className="relative mb-2 h-4">
              {frame.sections.map((section) =>
                fits(section.contentLength, CABIN_SHORT_LABELS[section.cabin], CAPS_CHAR_PX) ? (
                  <span
                    key={`${section.firstRow}-head`}
                    style={{ left: `${along(section.contentStart)}%`, width: `${along(section.contentLength)}%` }}
                    className={twMerge(
                      "absolute truncate text-[11px] font-bold uppercase tracking-wider text-gray-500 transition-opacity duration-150 motion-reduce:transition-none dark:text-gray-400",
                      spotlit !== null && section.cabin !== spotlit && "opacity-25",
                    )}
                  >
                    {CABIN_SHORT_LABELS[section.cabin]}
                  </span>
                ) : null,
              )}
            </div>

            <div
              className="relative"
              style={{ aspectRatio: `${frame.length} / ${frame.width}` }}
              onPointerMove={trackPointer}
              onPointerDown={tapSeat}
              onPointerLeave={leavePointer}
              onFocusCapture={focusSeat}
              onBlurCapture={clearPointer}
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

              {placements.map((placement) => (
                <Seat
                  key={placement.seat.designator}
                  designator={placement.seat.designator}
                  appearance={placement.appearance}
                  condition={placement.condition}
                  reversed={placement.seat.reversed}
                  isMuted={spotlit !== null && placement.seat.cabin !== spotlit}
                  description={placement.description}
                  style={placement.style}
                />
              ))}
            </div>

            <div className="relative mt-2 h-4">
              {frame.sections.map((section) =>
                fits(section.contentLength, rowRange(section), MONO_CHAR_PX) ? (
                  <span
                    key={`${section.firstRow}-rows`}
                    style={{ left: `${along(section.contentStart)}%`, width: `${along(section.contentLength)}%` }}
                    className={twMerge(
                      "absolute truncate font-mono text-[10px] text-gray-400 transition-opacity duration-150 motion-reduce:transition-none dark:text-gray-500",
                      spotlit !== null && section.cabin !== spotlit && "opacity-25",
                    )}
                  >
                    {rowRange(section)}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        </div>
        {popup && (
          <SeatTooltip seat={popup.seat} x={popup.x} y={popup.y} below={popup.below}>
            {mode.tooltip?.(popup.seat, deck.deck) ?? <SeatFacts seat={popup.seat} />}
          </SeatTooltip>
        )}
      </div>
    </figure>
  );
}

function seatDescription(seat: CabinSeat, appearance: SeatAppearance): string {
  const cabin = toHuman.cabinLayout.cabinClass(seat.cabin);
  const condition = seatCondition(seat);
  const parts = [
    `Seat ${seat.designator}`,
    cabin,
    appearance.label === cabin ? null : appearance.label,
    seat.windowStatus === null ? null : toHuman.cabinLayout.windowStatus(seat.windowStatus),
    condition === null ? null : CONDITION_LABELS[condition],
    seat.reversed ? "Rearward facing" : null,
  ];

  return parts.filter((part) => part !== null).join(", ");
}
