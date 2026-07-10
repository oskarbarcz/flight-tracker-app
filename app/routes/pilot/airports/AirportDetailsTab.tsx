import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { AirportDetailsCard } from "~/features/airport/components/Overview/AirportDetailsCard";

export default function AirportDetailsTab() {
  const { airport } = useAirportPreview();
  return <AirportDetailsCard airport={airport} readOnly />;
}
