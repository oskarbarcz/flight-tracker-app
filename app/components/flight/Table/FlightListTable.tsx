"use client";

import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useMemo } from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { useSearchParams } from "react-router";
import ReleaseFlightModal from "~/components/flight/Modal/ReleaseFlightModal";
import RemoveFlightModal from "~/components/flight/Modal/RemoveFlightModal";
import UpdatePreliminaryLoadsheetModal from "~/components/flight/Modal/UpdatePreliminaryLoadsheetModal";
import UpdateScheduledTimesheetModal from "~/components/flight/Modal/UpdateScheduledTimesheetModal";
import FlightListElement from "~/components/flight/Table/FlightListElement";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import {
  FilledSchedule,
  Flight,
  FlightPrecedenceStatus,
  FlightStatus,
  Loadsheet,
  precedenceToStatus,
} from "~/models";
import translateStatus from "~/models/translate/flight.translate";
import { useApi } from "~/state/contexts/content/api.context";

export type FlightListTableProps = {
  precedence: FlightPrecedenceStatus;
};

export default function FlightListTable({ precedence }: FlightListTableProps) {
  const { flightService } = useApi();
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [flightToRemove, setFlightToRemove] = React.useState<Flight | null>(
    null,
  );
  const [flightToUpdateTimesheet, setFlightToUpdateTimesheet] =
    React.useState<Flight | null>(null);
  const [flightToUpdateLoadsheet, setFlightToUpdateLoadsheet] =
    React.useState<Flight | null>(null);
  const [flightToRelease, setFlightToRelease] = React.useState<Flight | null>(
    null,
  );

  useEffect(() => {
    flightService.fetchAllFlights().then(setFlights);
  }, [flightService]);

  const removeFlight = async (flightId: string) => {
    await flightService.remove(flightId);
    setFlights((state) => state.filter((prev) => !(prev.id === flightId)));
    setFlightToRemove(null);
  };

  const updateSchedule = async (flightId: string, schedule: FilledSchedule) => {
    await flightService.updateScheduledTimesheet(flightId, schedule);
    const updated = await flightService.getById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToUpdateTimesheet(null);
  };

  const updateLoadsheet = async (flightId: string, loadsheet: Loadsheet) => {
    await flightService.updatePreliminaryLoadsheet(flightId, loadsheet);
    const updated = await flightService.getById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToUpdateLoadsheet(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    const updated = await flightService.getById(flightId);

    setFlights((state) =>
      state.map((prev) => (prev.id === updated.id ? updated : prev)),
    );
    setFlightToRelease(null);
  };

  return (
    <div className="rounded-2xl overflow-x-auto mb-6">
      <Table>
        <TableHead className="dark:text-gray-100">
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
          {Array.isArray(flights) &&
            flights
              .filter((flight) =>
                precedenceToStatus(precedence).includes(flight.status),
              )
              .sort((a, b) => a.flightNumber.localeCompare(b.flightNumber))
              .map((flight: Flight, i: number) => (
                <React.Fragment key={i}>
                  <FlightListElement
                    flight={flight}
                    onUpdateTimesheet={setFlightToUpdateTimesheet}
                    onUpdateLoadsheet={setFlightToUpdateLoadsheet}
                    onRemoveFlight={setFlightToRemove}
                    onReleaseFlight={setFlightToRelease}
                  />
                </React.Fragment>
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
