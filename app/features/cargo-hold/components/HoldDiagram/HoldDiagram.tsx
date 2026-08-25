import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { CompartmentCapabilities } from "~/features/cargo-hold/components/HoldDiagram/CompartmentCapabilities";
import { HoldDeckPlan } from "~/features/cargo-hold/components/HoldDiagram/HoldDeckPlan";
import { HoldDeckSwitcher } from "~/features/cargo-hold/components/HoldDiagram/HoldDeckSwitcher";
import { HoldLegend } from "~/features/cargo-hold/components/HoldDiagram/HoldLegend";
import { HoldPositionTable } from "~/features/cargo-hold/components/HoldDiagram/HoldPositionTable";
import { HoldPositionTooltip } from "~/features/cargo-hold/components/HoldDiagram/HoldPositionTooltip";
import { holdFrame } from "~/features/cargo-hold/lib/holdFrame";
import { acceptedReading, type HoldReading, type PositionAppearance } from "~/features/cargo-hold/lib/holdReading";
import {
  CompartmentLoading,
  type HoldDeckName,
  type HoldPosition,
  type HoldVariant,
} from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";
import { BlurReveal } from "~/shared/ui/Display/BlurReveal";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { FilterChoice } from "~/shared/ui/Filter/FilterChoice";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

type Props = {
  variant: HoldVariant;
  variants?: HoldVariant[];
  reading?: HoldReading;
  readings?: HoldReading[];
  detail?: HoldDiagramDetail;
};

export type HoldDiagramDetail = "none" | "compartments" | "full";

const MIN_TILE_PX = 26;
const LABEL_WIDTH_PX = 34;
const MAX_ASPECT = 11;
const REFERENCE_WIDTH_PX = 1060;
const MIN_RENDERED_DECK_PX = 38;
const TOOLTIP_CLEARANCE_PX = 190;
const TABLE_PREVIEW_HEIGHT = 120;

type Hover = {
  position: HoldPosition;
  appearance: PositionAppearance;
  x: number;
  y: number;
  below: boolean;
};

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

export function HoldDiagram({ variant, variants, reading, readings, detail = "full" }: Props) {
  const frame = useMemo(() => holdFrame(variant, variants ?? [variant]), [variant, variants]);
  const { ref, width } = useMeasuredWidth();
  const [selectedDeck, setSelectedDeck] = useState<HoldDeckName>(variant.decks[0].deck);
  const [hover, setHover] = useState<Hover | null>(null);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [positionQuery, setPositionQuery] = useState("");
  const [readingKey, setReadingKey] = useState(readings?.[0]?.key ?? "");
  const summaryId = useId();
  const tableId = useId();

  const placement = frame.decks.find((entry) => entry.deck.deck === selectedDeck) ?? frame.decks[0];
  const deck = placement.deck;
  const activeReading =
    reading ?? readings?.find((entry) => entry.key === readingKey) ?? readings?.[0] ?? acceptedReading;
  const readingNote = activeReading.note === undefined || activeReading.note === "" ? null : activeReading.note;

  const narrowestSlot = useMemo(() => {
    const lengths = frame.decks
      .flatMap((entry) => entry.compartments)
      .flatMap((compartment) => compartment.positions)
      .map((slot) => slot.length);
    return lengths.length === 0 ? 1 : Math.min(...lengths);
  }, [frame]);

  const tallestDeckPx = useMemo(() => Math.max(...frame.decks.map((entry) => entry.heightPx)), [frame]);

  const positions = useMemo(() => deck.compartments.flatMap((compartment) => compartment.positions), [deck]);
  const hasTaper = placement.compartments.some((compartment) => compartment.positions.some((slot) => slot.tapered));
  const hasLoose = deck.compartments.some((compartment) => compartment.loading === CompartmentLoading.Loose);

  const naturalWidth = Math.min(REFERENCE_WIDTH_PX, tallestDeckPx * MAX_ASPECT);
  const diagramWidth = Math.max(Math.min(width, naturalWidth), MIN_TILE_PX / narrowestSlot);
  const deckScale = diagramWidth / naturalWidth;
  const isNarrowerThanContainer = width > 0 && diagramWidth < width;

  const deckHeightPx = (heightPx: number) => Math.max(Math.round(heightPx * deckScale), MIN_RENDERED_DECK_PX);

  function selectDeck(next: HoldDeckName) {
    setPositionQuery("");
    setHover(null);
    setSelectedDeck(next);
  }

  const openTooltip = (position: HoldPosition, appearance: PositionAppearance, element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect();
    const below = rect.top < TOOLTIP_CLEARANCE_PX;
    setHover({ position, appearance, x: rect.left + rect.width / 2, y: below ? rect.bottom + 8 : rect.top - 8, below });
  };

  return (
    <div className="flex flex-col gap-4">
      {(variant.decks.length > 1 || (readings !== undefined && readings.length > 1)) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {variant.decks.length > 1 ? (
            <HoldDeckSwitcher decks={variant.decks} selected={deck.deck} onSelect={selectDeck} />
          ) : (
            <span />
          )}
          {readings !== undefined && readings.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {readings.map((entry) => (
                <FilterChoice
                  key={entry.key}
                  label={entry.label}
                  isSelected={entry.key === activeReading.key}
                  onSelect={() => setReadingKey(entry.key)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {readingNote !== null && (
        <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {readingNote}
        </p>
      )}

      <div ref={ref} className={isNarrowerThanContainer ? "flex justify-center py-8" : "overflow-x-auto"}>
        <div
          style={{ width: diagramWidth }}
          className="flex shrink-0 flex-col gap-1"
          aria-describedby={detail === "full" ? summaryId : undefined}
        >
          <HoldDeckPlan
            key={deck.deck}
            placement={placement}
            heightPx={deckHeightPx(tallestDeckPx)}
            reading={activeReading}
            width={diagramWidth}
            labelWidthPx={LABEL_WIDTH_PX}
            onOpen={openTooltip}
            onClose={() => setHover(null)}
          />
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span>Nose</span>
            <span>Tail</span>
          </div>
        </div>
      </div>

      <HoldLegend positions={positions} reading={activeReading} hasTaper={hasTaper} hasLoose={hasLoose} />

      {detail !== "none" && (
        <section className="flex flex-col gap-2">
          <FieldLabel>Compartments</FieldLabel>
          <CompartmentCapabilities key={deck.deck} compartments={deck.compartments} />
        </section>
      )}

      {detail === "full" && (
        <section className="flex flex-col gap-2">
          <FieldLabel>Available positions</FieldLabel>
          <p id={summaryId} className="sr-only">
            Every position of this deck with its compartment, side, accepted devices and weight limit — the same
            information the diagram carries.
          </p>
          {isTableOpen && (
            <div className="w-full sm:w-56">
              <FilterInput value={positionQuery} onChange={setPositionQuery} placeholder="Search position" />
            </div>
          )}

          <BlurReveal
            expanded={isTableOpen}
            onExpand={() => setIsTableOpen(true)}
            onCollapse={() => {
              setIsTableOpen(false);
              setPositionQuery("");
            }}
            label={`Show all positions of the ${toHuman.cargoHold.deck(deck.deck).toLowerCase()}`}
            overlayLabel="See all positions"
            collapseLabel="Hide positions"
            previewHeight={TABLE_PREVIEW_HEIGHT}
          >
            <HoldPositionTable deck={deck} id={tableId} query={positionQuery} />
          </BlurReveal>
        </section>
      )}

      {hover !== null && (
        <HoldPositionTooltip
          position={hover.position}
          appearance={hover.appearance}
          x={hover.x}
          y={hover.y}
          below={hover.below}
        />
      )}
    </div>
  );
}
