"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Airport } from "~/models";
import { Link, useLoaderData } from "react-router";
import { AirportService } from "~/state/api/airport.service";
import LocalizedTimeDisplay from "~/components/LocalizedTimeDisplay";
import { HiPencil } from "react-icons/hi";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientLoader(): Promise<Airport[]> {
  return new AirportService().getAll();
}

export default function AirportsListRoute() {
  usePageTitle("Airports list");

  const airports = useLoaderData<Airport[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Airports"
        linkText="Create new"
        linkUrl="/airports/new"
      />
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700">
        <Table>
          <TableHead className="dark:text-gray-100">
            <TableHeadCell>ICAO / IATA code</TableHeadCell>
            <TableHeadCell>Name / City</TableHeadCell>
            <TableHeadCell>Country</TableHeadCell>
            <TableHeadCell>Timezone</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {airports.map((airport: Airport, i: number) => (
              <TableRow
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="text-gray-900 dark:text-white">
                  {airport.icaoCode} / {airport.iataCode}
                </TableCell>
                <TableCell>
                  <span>{airport.name}</span>
                  <span className="block">{airport.city}</span>
                </TableCell>
                <TableCell>{airport.country}</TableCell>
                <TableCell>
                  {airport.timezone}
                  <br />
                  <span className="text-xs font-light">
                    (currently:{" "}
                    <LocalizedTimeDisplay timezone={airport.timezone} />)
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    to={`/airports/${airport.id}/edit`}
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
      </div>
    </ProtectedRoute>
  );
}
