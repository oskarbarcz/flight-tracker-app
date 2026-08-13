import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { NotamsPanel } from "~/features/notam/components/NotamsPanel";

export default function AirportNotamsTab() {
  const { airport, notams, isFiltered, clearFilter } = useAirportPreview();

  return <NotamsPanel icaoCode={airport.icaoCode} notams={notams} isFiltered={isFiltered} clearFilter={clearFilter} />;
}
