import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { TerminalList } from "~/features/terminal/components/TerminalList";

export default function AirportTerminalsTab() {
  const { airport, terminals } = useAirportPreview();

  if (terminals.length === 0) {
    return <PreviewEmptyState message="No terminals recorded for this airport." />;
  }

  return <TerminalList airportId={airport.id} terminals={terminals} readOnly />;
}
