import { Airport } from "~/models";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import LocalizedTimeDisplay from "~/components/LocalizedTimeDisplay";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import React from "react";

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
              {airport.timezone}
              <br />
              <span className="text-xs font-light">
                (currently: <LocalizedTimeDisplay timezone={airport.timezone} />
                )
              </span>
            </TableCell>
            <TableCell>
              <Link to={`/airports/${airport.id}/edit`} replace viewTransition>
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
