import React from "react";
import { FlightEventsTimeline } from "~/features/flight/components/Overview/FlightEventsTimeline";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";

export function HistoryEventsTab() {
  const { flight, events } = useHistoryFlight();

  if (!flight) return null;

  return (
    <div className="mt-4">
      <FlightEventsTimeline events={events} serviceType={flight.serviceType} />
    </div>
  );
}
