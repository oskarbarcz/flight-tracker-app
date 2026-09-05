import React from "react";
import type { MapIntent } from "~/app-state/useMapSettings";
import { AdsbProvider } from "~/features/adsb/hooks/useAdsbData";
import { FlightInfoBox } from "~/features/flight/components/Dashboard/Tracking/Box/FlightInfoBox";
import { MapBox } from "~/features/flight/components/Dashboard/Tracking/Map/MapBox";

type Props = {
  mapIntent: MapIntent;
};

export function FlightHeader({ mapIntent }: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
      <FlightInfoBox className="col-span-1" />
      <AdsbProvider>
        <MapBox className="xl:col-span-2 min-h-96" mapIntent={mapIntent} />
      </AdsbProvider>
    </section>
  );
}
