"use client";

import { Pagination, Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { useSearchParams } from "react-router";
import { FlightListElement } from "~/components/flight/Table/FlightListElement";
import type { Flight, FlightPhase } from "~/models";
import { useFlightList } from "~/state/api/context/useFlightList";

type Props = {
  phase: FlightPhase;
};

export function FlightListTable({ phase: _phase }: Props) {
  const { flights, loading, totalCount, limit } = useFlightList();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / limit);

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
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {flights.map((flight: Flight) => (
            <FlightListElement key={flight.id} flight={flight} />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex overflow-x-auto justify-center pt-2 pb-4  bg-gray-50 dark:bg-gray-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showIcons />
        </div>
      )}
    </div>
  );
}
