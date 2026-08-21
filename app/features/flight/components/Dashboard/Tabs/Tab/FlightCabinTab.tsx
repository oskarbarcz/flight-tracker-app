import React, { useMemo } from "react";
import { CabinOccupancyPanel } from "~/features/flight/components/Cabin/CabinOccupancyPanel";
import { ManifestFigures } from "~/features/flight/components/Cabin/ManifestFigures";
import { ManifestTable } from "~/features/flight/components/Cabin/ManifestTable";
import { ManifestUnavailableState } from "~/features/flight/components/Cabin/ManifestUnavailableState";
import { useFlightCabin } from "~/features/flight/hooks/useFlightCabin";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import {
  cabinTallies,
  layoutMismatch,
  loadsheetHeadcount,
  manifestTally,
  orderedPassengers,
} from "~/features/flight/lib/manifest";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

export function FlightCabinTab() {
  const { flight } = useTrackedFlight();
  const cabin = useFlightCabin(flight);

  const manifest = cabin.status === "ready" ? cabin.manifest : null;
  const seatMap = cabin.status === "ready" ? cabin.seatMap : null;

  const figures = useMemo(() => {
    if (manifest === null) {
      return null;
    }

    return {
      tally: manifestTally(manifest.passengers),
      cabins: cabinTallies(manifest.passengers, seatMap?.seatCounts ?? null),
      passengers: orderedPassengers(manifest.passengers, seatMap?.decks.map((deck) => deck.deck) ?? []),
    };
  }, [manifest, seatMap]);

  if (flight === null) {
    return null;
  }

  if (cabin.status === "loading") {
    return <LoadingData />;
  }

  if (cabin.status === "unavailable") {
    return (
      <div className="mt-4">
        <ManifestUnavailableState gap={cabin.gap} />
      </div>
    );
  }

  if (manifest === null || figures === null) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Container padding="condensed" header={<CardHeader title="Cabin occupancy" />}>
        <CabinOccupancyPanel manifest={manifest} seatMap={seatMap} mismatch={layoutMismatch(flight)} />
      </Container>

      <Container padding="condensed" header={<CardHeader title="Passenger manifest" />}>
        <ManifestFigures
          tally={figures.tally}
          cabins={figures.cabins}
          totalSeats={seatMap?.totalSeats ?? null}
          loadsheet={loadsheetHeadcount(flight.loadsheets)}
        />
        <ManifestTable passengers={figures.passengers} />
      </Container>
    </div>
  );
}
