"use client";

import { Pagination, Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { ReleaseFlightModal } from "~/components/flight/Modal/ReleaseFlightModal";
import { RemoveFlightModal } from "~/components/flight/Modal/RemoveFlightModal";
import { UpdatePreliminaryLoadsheetModal } from "~/components/flight/Modal/UpdatePreliminaryLoadsheetModal";
import { UpdateScheduledTimesheetModal } from "~/components/flight/Modal/UpdateScheduledTimesheetModal";
import { UpdateTrackingModal } from "~/components/flight/Modal/UpdateTrackingModal";
import { FlightListElement } from "~/components/flight/Table/FlightListElement";
import type { FilledSchedule, Flight, FlightPhase, Loadsheet, Tracking } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { useFlightList } from "~/state/api/context/useFlightList";

type Props = {
  phase: FlightPhase;
};

export function FlightListTable({ phase }: Props) {
  const { flightService } = useApi();
  const { flights, loading, reloadFlights, totalCount, limit } = useFlightList();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const [flightToRemove, setFlightToRemove] = useState<Flight | null>(null);
  const [flightToUpdateTimesheet, setFlightToUpdateTimesheet] = useState<Flight | null>(null);
  const [flightToUpdateLoadsheet, setFlightToUpdateLoadsheet] = useState<Flight | null>(null);
  const [flightToRelease, setFlightToRelease] = useState<Flight | null>(null);
  const [flightToUpdateTracking, setFlightToUpdateTracking] = useState<Flight | null>(null);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / limit);

  const removeFlight = async (flightId: string) => {
    await flightService.remove(flightId);
    reloadFlights(phase, page);
    setFlightToRemove(null);
  };

  const updateSchedule = async (flightId: string, schedule: FilledSchedule) => {
    await flightService.updateScheduledTimesheet(flightId, schedule);
    reloadFlights(phase, page);
    setFlightToUpdateTimesheet(null);
  };

  const updateLoadsheet = async (flightId: string, loadsheet: Loadsheet) => {
    await flightService.updatePreliminaryLoadsheet(flightId, loadsheet);
    reloadFlights(phase, page);
    setFlightToUpdateLoadsheet(null);
  };

  const releaseFlight = async (flightId: string) => {
    await flightService.markAsReady(flightId);
    reloadFlights(phase, page);
    setFlightToRelease(null);
  };

  const updateTracking = async (flightId: string, tracking: Tracking) => {
    await flightService.updateTracking(flightId, tracking);
    reloadFlights(phase, page);
    setFlightToUpdateTracking(null);
  };

  if (flights.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="rounded-2xl overflow-x-auto relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px]">
          <Spinner color="indigo" size="xl" />
        </div>
      )}
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
          {flights.map((flight: Flight) => (
            <FlightListElement
              key={flight.id}
              flight={flight}
              onUpdateTimesheet={setFlightToUpdateTimesheet}
              onUpdateLoadsheet={setFlightToUpdateLoadsheet}
              onRemoveFlight={setFlightToRemove}
              onReleaseFlight={setFlightToRelease}
              onUpdateTracking={setFlightToUpdateTracking}
            />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex overflow-x-auto justify-center pt-2 pb-4  bg-gray-50 dark:bg-gray-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showIcons />
        </div>
      )}

      {flightToRemove && (
        <RemoveFlightModal flight={flightToRemove} remove={removeFlight} cancel={() => setFlightToRemove(null)} />
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
        <ReleaseFlightModal flight={flightToRelease} release={releaseFlight} cancel={() => setFlightToRelease(null)} />
      )}
      {flightToUpdateTracking && (
        <UpdateTrackingModal
          flight={flightToUpdateTracking}
          update={updateTracking}
          cancel={() => setFlightToUpdateTracking(null)}
        />
      )}
    </div>
  );
}
