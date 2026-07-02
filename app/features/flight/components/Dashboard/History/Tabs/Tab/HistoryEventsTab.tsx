import React from "react";
import { FlightEventsTimeline } from "~/features/flight/components/Overview/FlightEventsTimeline";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";

export function HistoryEventsTab() {
  const { events } = useHistoryFlight();

  return (
    <div className="mt-4">
      <FlightEventsTimeline events={events} />
    </div>
  );
}
