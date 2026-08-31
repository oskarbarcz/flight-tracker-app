import React, { useMemo, useState } from "react";
import { CabinOccupancyPanel } from "~/features/flight/components/Cabin/CabinOccupancyPanel";
import { ManifestFigures } from "~/features/flight/components/Cabin/ManifestFigures";
import { ManifestTable, type StatusChoice } from "~/features/flight/components/Cabin/ManifestTable";
import { ManifestUnavailableState } from "~/features/flight/components/Cabin/ManifestUnavailableState";
import { useFlightCabin } from "~/features/flight/hooks/useFlightCabin";
import {
  cabinTallies,
  layoutMismatch,
  loadsheetHeadcount,
  manifestTally,
  orderedPassengers,
} from "~/features/flight/lib/manifest";
import type { Flight, Loadsheets } from "~/features/flight/model";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

type Props = {
  flight: Flight;
  loadsheets: Loadsheets;
  aircraftHref?: string;
};

const WIDE_ENOUGH_FOR_THE_DRAWING = "(min-width: 768px)";

export function FlightManifestPanel({ flight, loadsheets, aircraftHref }: Props) {
  const [status, setStatus] = useState<StatusChoice>("all");
  const cabin = useFlightCabin(flight, status === "all" ? undefined : status);
  const [isDrawingOpen, setIsDrawingOpen] = useState(() => window.matchMedia(WIDE_ENOUGH_FOR_THE_DRAWING).matches);

  const manifest = cabin.status === "ready" ? cabin.manifest : null;
  const fetchedSeatMap = cabin.status === "ready" ? cabin.seatMap : null;

  const redrawnRevision =
    manifest !== null && fetchedSeatMap !== null && fetchedSeatMap.revision !== manifest.cabinLayoutRevision
      ? fetchedSeatMap.revision
      : null;
  const seatMap = redrawnRevision === null ? fetchedSeatMap : null;

  const figures = useMemo(() => {
    if (manifest === null) {
      return null;
    }

    return {
      tally: manifestTally(manifest.passengers),
      cabins: cabinTallies(manifest.passengers, seatMap?.seatCounts ?? null, status !== "all"),
      passengers: orderedPassengers(manifest.passengers, seatMap?.decks.map((deck) => deck.deck) ?? []),
    };
  }, [manifest, seatMap, status]);

  if (cabin.status === "loading") {
    return <LoadingData />;
  }

  if (cabin.status === "unavailable") {
    return (
      <div className="mt-4">
        <ManifestUnavailableState gap={cabin.gap} aircraftHref={aircraftHref} />
      </div>
    );
  }

  if (manifest === null || figures === null) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed" header={<CardHeader title="Cabin occupancy" />}>
        <details open={isDrawingOpen} onToggle={(event) => setIsDrawingOpen(event.currentTarget.open)}>
          <summary className="cursor-pointer text-sm font-medium text-gray-600 marker:text-gray-400 dark:text-gray-300">
            Cabin drawing
          </summary>
          <div className="mt-3">
            <CabinOccupancyPanel
              manifest={manifest}
              seatMap={seatMap}
              mismatch={layoutMismatch(flight)}
              redrawnRevision={redrawnRevision}
            />
          </div>
        </details>
      </Container>

      <Container padding="condensed" header={<CardHeader title="Passenger manifest" />}>
        <ManifestFigures
          tally={figures.tally}
          cabins={figures.cabins}
          totalSeats={seatMap?.totalSeats ?? null}
          loadsheet={loadsheetHeadcount(loadsheets)}
          status={status}
        />
        <ManifestTable passengers={figures.passengers} status={status} onStatusChange={setStatus} />
      </Container>
    </div>
  );
}
