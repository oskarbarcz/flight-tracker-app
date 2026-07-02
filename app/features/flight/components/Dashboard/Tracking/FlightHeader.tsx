import React from "react";
import { AdsbProvider } from "~/features/adsb/hooks/useAdsbData";
import { FlightInfoBox } from "~/features/flight/components/Dashboard/Tracking/Box/FlightInfoBox";
import { MapBox } from "~/features/flight/components/Dashboard/Tracking/Map/MapBox";

export function FlightHeader() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <FlightInfoBox className="col-span-1" />
      <AdsbProvider>
        <MapBox className="md:col-span-2 min-h-96" />
      </AdsbProvider>
    </section>
  );
}
