"use client";

import { Pagination, Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { FlightHistoryListElement } from "~/components/flight/Table/FlightHistoryListElement";
import { type Flight, FlightPhase } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

const PAGE_SIZE = 10;

export function FlightHistoryListTable() {
  const { flightService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    flightService
      .fetchAllFlights({ phase: FlightPhase.Finished, page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setFlights(res.flights);
        setTotalCount(res.totalCount);
        markRefreshed();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [flightService, page, markRefreshed]);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (flights.length === 0 && !loading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/40 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        No flights in your history yet.
      </div>
    );
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
            <TableHeadCell>Date (UTC)</TableHeadCell>
            <TableHeadCell>Route</TableHeadCell>
            <TableHeadCell>Aircraft</TableHeadCell>
            <TableHeadCell>Block time</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {flights.map((flight) => (
            <FlightHistoryListElement key={flight.id} flight={flight} />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex overflow-x-auto justify-center pt-2 pb-4 bg-gray-50 dark:bg-gray-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showIcons />
        </div>
      )}
    </div>
  );
}
