"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightTimesheetRoute";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { UpdateScheduledTimesheetModal } from "~/components/flight/Modal/UpdateScheduledTimesheetModal";
import { TimesheetCard } from "~/components/flight/Overview/TimesheetCard";
import { type FilledSchedule, FlightStatus } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightService } from "~/state/api/flight.service";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightTimesheetRoute() {
  const { flight } = useLoaderData<typeof clientLoader>();
  const { flightService } = useApi();
  const { success, error } = useToast();
  const revalidator = useRevalidator();
  const [editing, setEditing] = useState(false);

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

  const canEditScheduled = flight.status === FlightStatus.Created;

  return (
    <div className="mt-3 flex flex-col gap-3">
      <TimesheetCard
        title="Scheduled timesheet"
        schedule={flight.timesheet.scheduled}
        onUpdate={canEditScheduled ? () => setEditing(true) : undefined}
      />
      {flight.timesheet.estimated && (
        <TimesheetCard title="Estimated timesheet" schedule={flight.timesheet.estimated} />
      )}
      {flight.timesheet.actual && <TimesheetCard title="Actual timesheet" schedule={flight.timesheet.actual} />}

      {editing && (
        <UpdateScheduledTimesheetModal flight={flight} update={handleUpdate} cancel={() => setEditing(false)} />
      )}
    </div>
  );
}
