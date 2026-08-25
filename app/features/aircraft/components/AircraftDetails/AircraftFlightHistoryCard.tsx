import { Pagination } from "flowbite-react";
import React, { useState } from "react";
import { type AircraftReposition, type FlightHistoryEntry, RepositionType } from "~/features/aircraft";
import {
  AIRCRAFT_HISTORY_GRID,
  AircraftHistoryRow,
} from "~/features/aircraft/components/AircraftDetails/AircraftHistoryRow";
import { entryTime } from "~/features/aircraft/lib/aircraftStatus";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

const PAGE_SIZE = 8;

type Props = {
  history: FlightHistoryEntry[];
  repositions: AircraftReposition[];
};

type TimelineItem =
  | { kind: "flight"; time: number; flight: FlightHistoryEntry }
  | { kind: "reposition"; time: number; reposition: AircraftReposition };

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

function itemDate(item: TimelineItem): Date | null {
  if (item.kind === "reposition") return new Date(item.reposition.createdAt);
  const onBlockTime = item.flight.actualTimesheet?.onBlockTime;
  return onBlockTime ? new Date(onBlockTime) : null;
}

export function AircraftFlightHistoryCard({ history, repositions }: Props) {
  const [page, setPage] = useState(1);
  const timeline = buildTimeline(history, repositions);
  const totalPages = Math.ceil(timeline.length / PAGE_SIZE);
  const pageItems = timeline.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Container className="h-full" padding="none" header={<CardHeader title="Flight history" />}>
      {timeline.length === 0 ? (
        <ContainerEmptyState>This aircraft has not operated any flights yet.</ContainerEmptyState>
      ) : (
        <>
          <div
            className={`${AIRCRAFT_HISTORY_GRID} border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400`}
            aria-hidden
          >
            <span className="px-1 py-2.5 sm:px-3">Date</span>
            <span className="px-1 py-2.5 sm:px-3">Flight</span>
            <span className="px-1 py-2.5 sm:px-3">Route</span>
            <span className="order-4 hidden px-1 py-2.5 sm:block sm:px-3">Status</span>
            <span className="order-4 sm:order-5" />
          </div>

          <ul>
            {pageItems.map((item) => (
              <li
                key={
                  item.kind === "flight"
                    ? `flight-${item.flight.flightNumber}-${item.time}`
                    : `rep-${item.reposition.id}`
                }
                className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
              >
                {item.kind === "flight" ? (
                  <AircraftHistoryRow
                    date={itemDate(item)}
                    identifier={item.flight.flightNumber}
                    departure={item.flight.departureAirport}
                    arrival={item.flight.arrivalAirport}
                    status={item.flight.status}
                    flightId={item.flight.id}
                  />
                ) : (
                  <AircraftHistoryRow
                    date={itemDate(item)}
                    identifier="—"
                    departure={item.reposition.departureAirport}
                    arrival={item.reposition.destinationAirport}
                    status={null}
                  />
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center border-t border-gray-200 bg-gray-50 pt-2 pb-3 dark:border-gray-800 dark:bg-gray-800">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} showIcons />
            </div>
          )}
        </>
      )}
    </Container>
  );
}
