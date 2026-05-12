import React from "react";
import { AircraftSummaryCard } from "~/components/flight/Dashboard/History/Box/AircraftSummaryCard";
import { HeadlineStats } from "~/components/flight/Dashboard/History/Box/HeadlineStats";
import { LoadsheetSummaryCard } from "~/components/flight/Dashboard/History/Box/LoadsheetSummaryCard";
import { PhaseTimelineBox } from "~/components/flight/Dashboard/History/Box/PhaseTimelineBox";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";

export function HistoryOverviewTab() {
  const { flight } = useHistoryFlight();

  if (!flight) return null;

  return (
    <div className="mt-4 flex flex-col gap-4">
      <HeadlineStats flight={flight} />
      <PhaseTimelineBox flight={flight} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AircraftSummaryCard flight={flight} />
        <LoadsheetSummaryCard preliminary={flight.loadsheets.preliminary} final={flight.loadsheets.final} />
      </div>
    </div>
  );
}
