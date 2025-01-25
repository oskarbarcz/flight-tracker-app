"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Airport } from "~/models";
import { Link, useLoaderData } from "react-router";
import { AirportService } from "~/state/services/airport.service";
import LocalizedTimeDisplay from "~/components/LocalizedTimeDisplay";
import { HiPencil } from "react-icons/hi";
import { UserRole } from "~/models/user.model";

export async function clientLoader(): Promise<Airport[] | Response> {
  return AirportService.getAll();
}

export default function AirportsListRoute() {
  const airports = useLoaderData<Airport[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Airports"
          linkText="Create new"
          linkUrl="/airports/new"
        />

        <Table className="shadow">
          <Table.Head>
            <Table.HeadCell>ICAO / IATA code</Table.HeadCell>
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
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
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
                  <Link to={`/airports/${airport.id}/edit`} replace>
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
