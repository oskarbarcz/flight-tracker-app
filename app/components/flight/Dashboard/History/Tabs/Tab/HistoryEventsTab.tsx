import React from "react";
import { FlightEventsTimeline } from "~/components/flight/Overview/FlightEventsTimeline";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";

export function HistoryEventsTab() {
  const { events } = useHistoryFlight();

  return (
    <div className="mt-4">
      <FlightEventsTimeline events={events} />
    </div>
  );
}
