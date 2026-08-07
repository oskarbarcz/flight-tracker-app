import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { RunwayList } from "~/features/runway/components/RunwayList";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportRunwaysTab() {
  const { airport, runways, isFiltered, clearFilter } = useAirportPreview();

  if (runways.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="runways" onClear={clearFilter} />
    ) : (
      <PreviewEmptyState message="No runways recorded for this airport." />
    );
  }

  return <RunwayList airportId={airport.id} runways={runways} readOnly />;
}
