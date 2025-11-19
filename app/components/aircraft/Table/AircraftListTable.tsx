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
          <TableHeadCell>ICAO code</TableHeadCell>
          <TableHeadCell>Registration & livery</TableHeadCell>
          <TableHeadCell>Short name</TableHeadCell>
          <TableHeadCell>Long name</TableHeadCell>
          <TableHeadCell>Operator</TableHeadCell>
          <TableHeadCell>SELCAL</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {aircraft.map((each: Aircraft, i: number) => (
          <TableRow key={i} className="dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="text-gray-900 dark:text-white">
              {each.icaoCode}
            </TableCell>
            <TableCell>
              <span>{each.registration}</span>
              <span className="block">{each.livery}</span>
            </TableCell>
            <TableCell>{each.shortName}</TableCell>
            <TableCell>{each.fullName}</TableCell>
            <TableCell>
              <span>{each.operator.shortName}</span>
              <span className="block">[{each.operator.icaoCode}]</span>
            </TableCell>
            <TableCell>{each.selcal}</TableCell>
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
