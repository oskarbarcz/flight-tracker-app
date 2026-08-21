import React, { useId, useMemo, useState } from "react";
import { CabinDescriptions } from "~/features/cabin-layout/components/SeatMap/CabinDescriptions";
import { CabinDiagram } from "~/features/cabin-layout/components/SeatMap/CabinDiagram";
import { DeckSwitcher } from "~/features/cabin-layout/components/SeatMap/DeckSwitcher";
import { SeatLegend } from "~/features/cabin-layout/components/SeatMap/SeatLegend";
import { SeatTable } from "~/features/cabin-layout/components/SeatMap/SeatTable";
import { minimumScale, widestFrame } from "~/features/cabin-layout/lib/cabinFrame";
import { cabinClassMode, ratingMode, type SeatMode } from "~/features/cabin-layout/lib/seatAppearance";
import type { CabinClass, CabinSeatMap, Deck } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";
import { BlurReveal } from "~/shared/ui/Display/BlurReveal";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { FilterChoice } from "~/shared/ui/Filter/FilterChoice";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

type Props = {
  seatMap: CabinSeatMap;
  mode?: SeatMode;
  diagramOnly?: boolean;
};

const TABLE_PREVIEW_HEIGHT = 120;
const CABINS_PREVIEW_HEIGHT = 100;

const CHOICES = [
  { key: "cabin", label: "By cabin", mode: cabinClassMode },
  { key: "rating", label: "By rating", mode: ratingMode },
];

export function SeatMap({ seatMap, mode, diagramOnly = false }: Props) {
  const [selectedDeck, setSelectedDeck] = useState<Deck>(seatMap.decks[0].deck);
  const [choice, setChoice] = useState(CHOICES[0].key);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [areCabinsOpen, setAreCabinsOpen] = useState(false);
  const [spotlit, setSpotlit] = useState<CabinClass | null>(null);
  const [seatQuery, setSeatQuery] = useState("");
  const summaryId = useId();
  const tableId = useId();

  const deck = seatMap.decks.find((entry) => entry.deck === selectedDeck) ?? seatMap.decks[0];
  const activeMode = mode ?? (CHOICES.find((entry) => entry.key === choice) ?? CHOICES[0]).mode;

  function selectDeck(next: Deck) {
    setSpotlit(null);
    setSeatQuery("");
    setSelectedDeck(next);
  }

  function closeCabins() {
    setSpotlit(null);
    setAreCabinsOpen(false);
  }

  const basis = useMemo(() => widestFrame(seatMap.decks), [seatMap.decks]);
  const minScale = useMemo(() => minimumScale(seatMap.decks), [seatMap.decks]);

  return (
    <div className="flex flex-col gap-4">
      {(seatMap.decks.length > 1 || mode === undefined) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {seatMap.decks.length > 1 ? (
            <DeckSwitcher decks={seatMap.decks} selected={deck.deck} onSelect={selectDeck} />
          ) : (
            <span />
          )}
          {mode === undefined && (
            <div className="flex gap-1.5">
              {CHOICES.map((entry) => (
                <FilterChoice
                  key={entry.key}
                  label={entry.label}
                  isSelected={entry.key === choice}
                  onSelect={() => setChoice(entry.key)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <CabinDiagram
        key={deck.deck}
        deck={deck}
        basis={basis}
        minScale={minScale}
        mode={activeMode}
        spotlit={areCabinsOpen ? spotlit : null}
        describedBy={diagramOnly ? undefined : summaryId}
      />

      <SeatLegend seats={deck.seats} deck={deck.deck} mode={activeMode} />

      {!diagramOnly && (
        <>
          <section className="flex flex-col gap-2">
            <FieldLabel>Available cabins</FieldLabel>
            <BlurReveal
              expanded={areCabinsOpen}
              onExpand={() => setAreCabinsOpen(true)}
              onCollapse={closeCabins}
              label={`Show the cabins of the ${toHuman.cabinLayout.deck(deck.deck)}`}
              overlayLabel="See all cabins"
              collapseLabel="Hide cabins"
              previewHeight={CABINS_PREVIEW_HEIGHT}
              contentClassName="px-1.5"
            >
              <CabinDescriptions key={deck.deck} deck={deck} onActiveChange={setSpotlit} />
            </BlurReveal>
          </section>

          <section className="flex flex-col gap-2">
            <FieldLabel>Available seats</FieldLabel>
            <p id={summaryId} className="sr-only">
              The available seats list carries every seat of this deck with its cabin, rating, window position and
              comments — the same information the diagram carries.
            </p>
            {isTableOpen && (
              <div className="w-full sm:w-56">
                <FilterInput value={seatQuery} onChange={setSeatQuery} placeholder="Search seat number" />
              </div>
            )}

            <BlurReveal
              expanded={isTableOpen}
              onExpand={() => setIsTableOpen(true)}
              onCollapse={() => {
                setIsTableOpen(false);
                setSeatQuery("");
              }}
              label={`Show all ${deck.seatCount} seats of the ${toHuman.cabinLayout.deck(deck.deck)}`}
              overlayLabel="See all seats"
              collapseLabel="Hide seats"
              previewHeight={TABLE_PREVIEW_HEIGHT}
              contentClassName="px-1.5"
            >
              <SeatTable deck={deck} id={tableId} query={seatQuery} />
            </BlurReveal>
          </section>
        </>
      )}
    </div>
  );
}
