import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import type { Aircraft } from "~/models";

type Props = {
  operatorId: string;
  aircraft: Aircraft[];
};

export default function AircraftListTable({ operatorId, aircraft }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Reg, SELCAL & livery</TableHeadCell>
          <TableHeadCell>ICAO code</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {aircraft.map((each: Aircraft) => (
          <TableRow key={each.id}>
            <TableCell className="text-gray-900 dark:text-gray-100">
              <span className="block font-bold">{each.shortName}</span>
              <span className="block italic">{each.fullName}</span>
            </TableCell>
            <TableCell>
              <span className="flex gap-x-2 items-center">
                <span className="rounded-md border border-gray-600 px-2 py-0.5 text-xs">{each.registration}</span>
                <span className="border border-gray-600 px-2 py-0.5 text-xs">{each.selcal}</span>
              </span>
              <span className="block mt-1">{each.livery}</span>
            </TableCell>
            <TableCell className="font-mono font-bold">{each.icaoCode}</TableCell>
            <TableCell>
              <Link
                className="text-primary-500 font-bold"
                to={`/operators/${operatorId}/aircraft/${each.id}/edit`}
                viewTransition
              >
                Edit
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
