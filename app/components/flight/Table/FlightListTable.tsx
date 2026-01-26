"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useState } from "react";
import ReleaseFlightModal from "~/components/flight/Modal/ReleaseFlightModal";
import RemoveFlightModal from "~/components/flight/Modal/RemoveFlightModal";
import UpdatePreliminaryLoadsheetModal from "~/components/flight/Modal/UpdatePreliminaryLoadsheetModal";
import UpdateScheduledTimesheetModal from "~/components/flight/Modal/UpdateScheduledTimesheetModal";
import FlightListElement from "~/components/flight/Table/FlightListElement";
import {
  FilledSchedule,
  Flight,
  FlightPrecedenceStatus,
  Loadsheet,
  precedenceToStatus,
} from "~/models";
import { useApi } from "~/state/contexts/content/api.context";
import { useFlightList } from "~/state/contexts/content/flight-list.context";

export type FlightListTableProps = {
  precedence: FlightPrecedenceStatus;
};

export default function FlightListTable({ precedence }: FlightListTableProps) {
  const { flightService } = useApi();
  const { flights, refreshFlights } = useFlightList();
  const [flightToRemove, setFlightToRemove] = useState<Flight | null>(null);
  const [flightToUpdateTimesheet, setFlightToUpdateTimesheet] =
    useState<Flight | null>(null);
  const [flightToUpdateLoadsheet, setFlightToUpdateLoadsheet] =
    useState<Flight | null>(null);
  const [flightToRelease, setFlightToRelease] = useState<Flight | null>(null);

  const removeFlight = async (flightId: string) => {
    await flightService.remove(flightId);
    await refreshFlights();
    setFlightToRemove(null);
  };

  const updateSchedule = async (flightId: string, schedule: FilledSchedule) => {
    await flightService.updateScheduledTimesheet(flightId, schedule);
    await refreshFlights();
    setFlightToUpdateTimesheet(null);
  };

  const updateLoadsheet = async (flightId: string, loadsheet: Loadsheet) => {
    await flightService.updatePreliminaryLoadsheet(flightId, loadsheet);
    await refreshFlights();
    setFlightToUpdateLoadsheet(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    await refreshFlights();
    setFlightToRelease(null);
  };

  return (
    <div className="rounded-2xl overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Flight no</TableHeadCell>
            <TableHeadCell>Route</TableHeadCell>
            <TableHeadCell>Departure (UTC)</TableHeadCell>
            <TableHeadCell>Aircraft</TableHeadCell>
            <TableHeadCell>Operator</TableHeadCell>
            <TableHeadCell>Tracking</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {flights
            .filter((flight) =>
              precedenceToStatus(precedence).includes(flight.status),
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((flight: Flight, i: number) => (
              <FlightListElement
                key={i}
                flight={flight}
                onUpdateTimesheet={setFlightToUpdateTimesheet}
                onUpdateLoadsheet={setFlightToUpdateLoadsheet}
                onRemoveFlight={setFlightToRemove}
                onReleaseFlight={setFlightToRelease}
              />
            ))}
        </TableBody>
      </Table>

      {flightToRemove && (
        <RemoveFlightModal
          flight={flightToRemove}
          remove={removeFlight}
          cancel={() => setFlightToRemove(null)}
        />
      )}
      {flightToUpdateTimesheet && (
        <UpdateScheduledTimesheetModal
          flight={flightToUpdateTimesheet}
          update={updateSchedule}
          cancel={() => setFlightToUpdateTimesheet(null)}
        />
      )}
      {flightToUpdateLoadsheet && (
        <UpdatePreliminaryLoadsheetModal
          flight={flightToUpdateLoadsheet}
          update={updateLoadsheet}
          cancel={() => setFlightToUpdateLoadsheet(null)}
        />
      )}
      {flightToRelease && (
        <ReleaseFlightModal
          flight={flightToRelease}
          release={releaseFlight}
          cancel={() => setFlightToRelease(null)}
        />
      )}
    </div>
  );
}
