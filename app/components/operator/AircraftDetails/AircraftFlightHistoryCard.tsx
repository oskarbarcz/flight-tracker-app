import { Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineClock } from "react-icons/hi";
import { Link } from "react-router";
import { FlightStatusBadge } from "~/components/shared/Flight/FlightStatusBadge";
import { entryTime } from "~/functions/aircraftStatus";
import { type AircraftReposition, type FlightHistoryEntry, RepositionType } from "~/models";
import { formatDate } from "~/shared/lib/time";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

const PAGE_SIZE = 8;

type Props = {
  history: FlightHistoryEntry[];
  repositions: AircraftReposition[];
};

type TimelineItem =
  | { kind: "flight"; time: number; flight: FlightHistoryEntry }
  | { kind: "reposition"; time: number; reposition: AircraftReposition };

function onBlockDate(entry: FlightHistoryEntry): string {
  const onBlockTime = entry.actualTimesheet?.onBlockTime;
  return onBlockTime ? formatDate(new Date(onBlockTime)) : "—";
}

function sortKey(item: TimelineItem): number {
  return item.time === 0 ? Number.MAX_SAFE_INTEGER : item.time;
}

function buildTimeline(history: FlightHistoryEntry[], repositions: AircraftReposition[]): TimelineItem[] {
  const flights: TimelineItem[] = history.map((flight) => ({ kind: "flight", time: entryTime(flight), flight }));
  const deadHeads: TimelineItem[] = repositions
    .filter((reposition) => reposition.type !== RepositionType.PerformingFlight)
    .map((reposition) => ({ kind: "reposition", time: new Date(reposition.createdAt).getTime(), reposition }));

  return [...flights, ...deadHeads].sort((a, b) => sortKey(b) - sortKey(a));
}

function AirportLink({ id, code, className }: { id: string; code: string; className?: string }) {
  return (
    <Link to={`/airports/${id}/overview`} viewTransition className={`hover:text-primary-500 ${className ?? ""}`}>
      {code}
    </Link>
  );
}

function FlightRow({ flight }: { flight: FlightHistoryEntry }) {
  return (
    <TableRow className="h-14">
      <TableCell className="font-mono font-bold text-gray-900 dark:text-gray-100">
        {flight.id ? (
          <Link to={`/flights/${flight.id}/overview`} viewTransition className="hover:text-primary-500">
            {flight.flightNumber}
          </Link>
        ) : (
          flight.flightNumber
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <AirportLink
            id={flight.departureAirport.id}
            code={flight.departureAirport.iataCode}
            className="font-mono font-bold"
          />
          <span className="text-gray-400">→</span>
          <AirportLink
            id={flight.arrivalAirport.id}
            code={flight.arrivalAirport.iataCode}
            className="font-mono font-bold"
          />
        </div>
      </TableCell>
      <TableCell>
        <FlightStatusBadge status={flight.status} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">{onBlockDate(flight)}</TableCell>
    </TableRow>
  );
}

function RepositionRow({ reposition }: { reposition: AircraftReposition }) {
  return (
    <TableRow className="h-14">
      <TableCell colSpan={4} className="text-center text-xs italic text-gray-400 dark:text-gray-500">
        (reposition flight{" "}
        <AirportLink
          id={reposition.departureAirport.id}
          code={reposition.departureAirport.iataCode}
          className="font-bold"
        />{" "}
        →{" "}
        <AirportLink
          id={reposition.destinationAirport.id}
          code={reposition.destinationAirport.iataCode}
          className="font-bold"
        />{" "}
        on <span className="font-mono font-bold not-italic">{formatDate(new Date(reposition.createdAt))}z</span>)
      </TableCell>
    </TableRow>
  );
}

export function AircraftFlightHistoryCard({ history, repositions }: Props) {
  const [page, setPage] = useState(1);
  const timeline = buildTimeline(history, repositions);
  const totalPages = Math.ceil(timeline.length / PAGE_SIZE);
  const pageItems = timeline.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const fillerCount = totalPages > 1 ? PAGE_SIZE - pageItems.length : 0;
  const fillerKeys = Array.from({ length: fillerCount }, (_, index) => `filler-${page}-${index}`);

  return (
    <Container className="h-full">
      <ContainerTitle icon={HiOutlineClock} title="Flight history" />

      {timeline.length === 0 ? (
        <ContainerEmptyState>This aircraft has not operated any flights yet.</ContainerEmptyState>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Flight</TableHeadCell>
                <TableHeadCell>Route</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {pageItems.map((item) =>
                item.kind === "flight" ? (
                  <FlightRow key={`flight-${item.flight.flightNumber}-${item.time}`} flight={item.flight} />
                ) : (
                  <RepositionRow key={`reposition-${item.reposition.id}`} reposition={item.reposition} />
                ),
              )}
              {fillerKeys.map((key) => (
                <TableRow key={key} aria-hidden className="h-14">
                  <TableCell colSpan={4} className="h-14" />
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center pt-3">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showIcons />
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
