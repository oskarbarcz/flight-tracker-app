import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import type { Operator } from "~/models";

type OperatorListTableProps = {
  operators: Operator[];
};

export default function OperatorListTable({ operators }: OperatorListTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ICAO/IATA code</TableHeadCell>
          <TableHeadCell>Short name</TableHeadCell>
          <TableHeadCell>Full name</TableHeadCell>
          <TableHeadCell>Callsign</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {operators.map((operator: Operator) => (
          <TableRow key={operator.id}>
            <TableCell>
              <span className="font-bold text-black dark:text-white">{operator.icaoCode}</span>
              <span> / </span>
              <span className="font-bold text-black dark:text-white">{operator.iataCode}</span>
            </TableCell>
            <TableCell>{operator.shortName}</TableCell>
            <TableCell>{operator.fullName}</TableCell>
            <TableCell>{operator.callsign}</TableCell>
            <TableCell className="space-x-3">
              <Link className="text-primary-500 font-bold" to={`/operators/${operator.id}/rotations`} viewTransition>
                Details
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
