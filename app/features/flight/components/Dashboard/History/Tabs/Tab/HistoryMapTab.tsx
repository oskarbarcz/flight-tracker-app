import React from "react";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { HistoryFlightMap } from "~/features/flight/components/Map/Box/HistoryFlightMap";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";
import { Container } from "~/shared/ui/Layout/Container";

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
