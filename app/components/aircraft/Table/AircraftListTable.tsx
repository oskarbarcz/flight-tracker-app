import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { Aircraft } from "~/models";

type AircraftListTableProps = {
  aircraft: Aircraft[];
};

export default function AircraftListTable({
  aircraft,
}: AircraftListTableProps) {
  return (
    <Table className="shadow">
      <TableHead className="dark:text-gray-100">
        <TableRow>
          <TableHeadCell>Reg, SELCAL & livery</TableHeadCell>
          <TableHeadCell>ICAO code</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Operator</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {aircraft.map((each: Aircraft, i: number) => (
          <TableRow key={i} className="dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="text-gray-900 dark:text-white">
              <span className="flex gap-x-2 items-center">
                <span className="rounded-md border border-gray-600 px-2 py-0.5 text-xs">
                  {each.registration}
                </span>
                <span className="border border-gray-600 px-2 py-0.5 text-xs">
                  {each.selcal}
                </span>
              </span>
              <span className="block mt-1">{each.livery}</span>
            </TableCell>
            <TableCell className="font-mono font-bold">
              {each.icaoCode}
            </TableCell>
            <TableCell>
              <span className="block font-bold">{each.shortName}</span>
              <span className="block italic">{each.fullName}</span>
            </TableCell>
            <TableCell>{each.operator.shortName}</TableCell>
            <TableCell>
              <Link to={`/aircraft/${each.id}/edit`} replace viewTransition>
                <Button color="gray">
                  <HiPencil />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
