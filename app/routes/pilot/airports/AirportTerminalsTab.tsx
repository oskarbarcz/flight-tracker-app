import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { TerminalList } from "~/features/terminal/components/TerminalList";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportTerminalsTab() {
  const { airport, terminals, isFiltered, clearFilter } = useAirportPreview();

  if (terminals.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="terminals" onClear={clearFilter} />
    ) : (
      <PreviewEmptyState message="No terminals recorded for this airport." />
    );
  }

  return <TerminalList airportId={airport.id} terminals={terminals} readOnly />;
}
