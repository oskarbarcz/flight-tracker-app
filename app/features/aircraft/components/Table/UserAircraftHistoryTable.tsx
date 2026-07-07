import { Pagination, Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { UserAircraftEntry } from "~/features/aircraft";
import { UserAircraftHistoryElement } from "~/features/aircraft/components/Table/UserAircraftHistoryElement";
import { useApi } from "~/shared/api/useApi";

const PAGE_SIZE = 12;

export function UserAircraftHistoryTable() {
  const { aircraftService } = useApi();
  const [entries, setEntries] = useState<UserAircraftEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    aircraftService
      .fetchFlownByCurrentUser()
      .then((res) => {
        if (cancelled) return;
        setEntries(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [aircraftService]);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (entries.length === 0 && !loading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        You haven't flown any aircraft yet.
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
            <TableHeadCell>Aircraft</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Route</TableHeadCell>
            <TableHeadCell>Operator</TableHeadCell>
            <TableHeadCell>Livery</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {pageEntries.map((entry) => (
            <UserAircraftHistoryElement key={`${entry.flight.id}-${entry.id}`} entry={entry} />
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
