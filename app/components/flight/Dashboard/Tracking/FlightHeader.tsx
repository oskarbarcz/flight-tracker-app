"use client";

import React from "react";
import FlightInfoBox from "~/components/flight/Dashboard/Tracking/FlightInfoBox";
import { MapBox } from "~/components/flight/Dashboard/Tracking/Map/MapBox";
import { AdsbProvider } from "~/state/contexts/content/adsb.context";

export default function FlightHeader() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <FlightInfoBox className="col-span-1" />
      <AdsbProvider>
        <MapBox className="md:col-span-2 min-h-96" />
      </AdsbProvider>
    </section>
  );
}
