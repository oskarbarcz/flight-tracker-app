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
import { Operator } from "~/models";

type OperatorListTableProps = {
  operators: Operator[];
};

export default function OperatorListTable({
  operators,
}: OperatorListTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ICAO code</TableHeadCell>
          <TableHeadCell>Short name</TableHeadCell>
          <TableHeadCell>Full name</TableHeadCell>
          <TableHeadCell>Callsign</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {operators.map((operator: Operator, i: number) => (
          <TableRow key={i}>
            <TableCell className="font-bold text-black dark:text-white">
              {operator.icaoCode}
            </TableCell>
            <TableCell>{operator.shortName}</TableCell>
            <TableCell>{operator.fullName}</TableCell>
            <TableCell>{operator.callsign}</TableCell>
            <TableCell>
              <Link
                className="block text-primary-500 font-bold"
                to={`/operators/${operator.id}/edit`}
                replace
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
