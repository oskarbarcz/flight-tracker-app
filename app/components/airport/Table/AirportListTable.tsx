import { Airport } from "~/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router";
import React from "react";
import {FormattedTimezoneTime} from "~/components/shared/Date/FormattedTimezoneTime";

type AirportListTableProps = {
  airports: Airport[];
};

export default function AirportListTable({ airports }: AirportListTableProps) {
  return (
    <Table>
      <TableHead className="dark:text-gray-100">
        <TableRow>
          <TableHeadCell>IATA code</TableHeadCell>
          <TableHeadCell>Name and location</TableHeadCell>
          <TableHeadCell>Timezone</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Actions</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {airports.map((airport: Airport, i: number) => (
          <TableRow key={i}>
            <TableCell className="font-bold text-gray-900 dark:text-white">
              {airport.iataCode}
            </TableCell>
            <TableCell>
              <span className="font-bold">{airport.name}</span>
              <span className="block">
                {airport.city}, {airport.country}
              </span>
            </TableCell>
            <TableCell>
              <FormattedTimezoneTime date={new Date()} timezone={airport.timezone} />
            </TableCell>
            <TableCell>
              <Link
                className="block text-primary-500 font-bold"
                to={`/airports/${airport.id}/edit`}
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
