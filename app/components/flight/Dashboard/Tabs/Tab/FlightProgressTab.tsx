import React from "react";
import { FlightEventsTimeline } from "~/components/flight/Overview/FlightEventsTimeline";
import { TimesheetCard } from "~/components/flight/Overview/TimesheetCard";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function FlightProgressTab() {
  const { flight, events } = useTrackedFlight();

  if (!flight) return null;

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[22rem_1fr]">
      <FlightEventsTimeline events={events} />

      <div className="flex flex-col gap-3">
        <TimesheetCard
          title="Scheduled timesheet"
          subtitle="Filled by OCC and submitted to air navigation services."
          schedule={flight.timesheet.scheduled}
          emptyMessage="No scheduled timesheet has been filed."
        />
        <TimesheetCard
          title="Estimated timesheet"
          subtitle="Entered by the pilot once the operational flight plan is finalised."
          schedule={flight.timesheet.estimated}
          emptyMessage="Waiting for the pilot to check in."
        />
        <TimesheetCard
          title="Actual timesheet"
          subtitle="Recorded automatically as flight events are reported."
          schedule={flight.timesheet.actual}
          emptyMessage="Times will appear here as the flight progresses."
        />
      </div>
    </div>
  );
}
