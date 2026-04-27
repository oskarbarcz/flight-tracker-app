"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightTimesheetRoute";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useLoaderData, useRevalidator } from "react-router";
import { UpdateScheduledTimesheetModal } from "~/components/flight/Modal/UpdateScheduledTimesheetModal";
import { FlightEventsTimeline } from "~/components/flight/Overview/FlightEventsTimeline";
import { TimesheetCard } from "~/components/flight/Overview/TimesheetCard";
import { type FilledSchedule, FlightStatus } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightService } from "~/state/api/flight.service";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flightService = new FlightService();
  const [flight, events] = await Promise.all([
    flightService.fetchById(params.id),
    flightService.fetchEventsByFlightId(params.id),
  ]);
  return { flight, events };
}

export default function FlightTimesheetRoute() {
  const { flight, events } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [editing, setEditing] = useState(false);

  const canEditScheduled = flight.status === FlightStatus.Created;

  const handleUpdate = async (flightId: string, schedule: FilledSchedule) => {
    try {
      await flightService.updateScheduledTimesheet(flightId, schedule);
      success("Scheduled timesheet updated.");
      setEditing(false);
      revalidator.revalidate();
    } catch {
      error("Failed to update scheduled timesheet.");
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[22rem_1fr]">
      <FlightEventsTimeline events={events} />

      <div className="flex flex-col gap-3">
        <TimesheetCard
          title="Scheduled timesheet"
          subtitle="Filled by OCC and submitted to air navigation services."
          schedule={flight.timesheet.scheduled}
          emptyMessage="No scheduled timesheet has been filed."
          footer={
            canEditScheduled && (
              <Button color="gray" outline size="xs" onClick={() => setEditing(true)}>
                <HiPencil className="me-1.5" />
                Update
              </Button>
            )
          }
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

      {editing && (
        <UpdateScheduledTimesheetModal flight={flight} update={handleUpdate} cancel={() => setEditing(false)} />
      )}
    </div>
  );
}
