import React from "react";
import { HistoryFlightMap } from "~/components/flight/Map/Box/HistoryFlightMap";
import { Container } from "~/components/shared/Layout/Container";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";
import { MapSettingsProvider } from "~/state/app/context/useMapSettings";

export function HistoryMapTab() {
  const { flight, diversion } = useHistoryFlight();

  if (!flight) return null;

  return (
    <Container padding="none" className="mt-4">
      <div className="relative h-[32rem] w-full">
        <MapSettingsProvider>
          <HistoryFlightMap flight={flight} diversion={diversion} />
        </MapSettingsProvider>
      </div>
    </Container>
  );
}
