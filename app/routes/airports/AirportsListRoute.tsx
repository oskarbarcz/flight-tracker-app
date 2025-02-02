"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
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
          <Table.Head className="dark:text-gray-100">
            <Table.HeadCell>
              ICAO / IATA code
            </Table.HeadCell>
            <Table.HeadCell>Name / City</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>Timezone</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {airports.map((airport: Airport, i: number) => (
              <Table.Row
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="text-gray-900 dark:text-white">
                  {airport.icaoCode} / {airport.iataCode}
                </Table.Cell>
                <Table.Cell>
                  <span>{airport.name}</span>
                  <span className="block">{airport.city}</span>
                </Table.Cell>
                <Table.Cell>{airport.country}</Table.Cell>
                <Table.Cell>
                  {airport.timezone}
                  <br />
                  <span className="text-xs font-light">
                    (currently:{" "}
                    <LocalizedTimeDisplay timezone={airport.timezone} />)
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/airports/${airport.id}/edit`}
                    replace
                    viewTransition
                  >
                    <Button color="gray">
                      <HiPencil />
                    </Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </ProtectedRoute>
  );
}
