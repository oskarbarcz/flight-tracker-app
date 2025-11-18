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
      <TableHead className="dark:text-gray-100">
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
          <TableRow key={i} className="dark:border-gray-700">
            <TableCell className="text-gray-900 dark:text-white">
              {operator.icaoCode}
            </TableCell>
            <TableCell>{operator.shortName}</TableCell>
            <TableCell>{operator.fullName}</TableCell>
            <TableCell>{operator.callsign}</TableCell>
            <TableCell>
              <Link
                to={`/operators/${operator.id}/edit`}
                replace
                viewTransition
              >
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
