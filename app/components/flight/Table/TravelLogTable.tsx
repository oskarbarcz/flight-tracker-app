import { Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { TravelLogListElement } from "~/components/flight/Table/TravelLogListElement";
import { useUserTravels } from "~/features/user/hooks/useUserTravels";

export function TravelLogTable() {
  const { travels, loading } = useUserTravels();

  if (travels.length === 0 && !loading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/40 px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        No travels in your history yet.
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
            <TableHeadCell>Date (UTC)</TableHeadCell>
            <TableHeadCell>Route</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Distance</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {travels.map((travel) => (
            <TravelLogListElement key={travel.id} travel={travel} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
