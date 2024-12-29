"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink/SectionHeaderWithLink";
import { Table } from "flowbite-react";
import { Airport } from "~/models";
import { useLoaderData } from "react-router";
import { AirportService } from "~/state/services/airport.service";
import LocalizedTimeDisplay from "~/components/LocalizedTimeDisplay";

export async function clientLoader(): Promise<Airport[]> {
  return AirportService.fetchAllAirports();
}

export default function AirportsListRoute() {
  const airports: Airport[] = useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Airports"
          linkText="Create new"
          linkUrl="/airports/new"
        />

        <Table className="shadow">
          <Table.Head>
            <Table.HeadCell>ICAO code</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>Timezone</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {airports.map((airport: Airport, i: number) => (
              <Table.Row
                key={i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {airport.icaoCode}
                </Table.Cell>
                <Table.Cell>{airport.name}</Table.Cell>
                <Table.Cell>{airport.country}</Table.Cell>
                <Table.Cell>
                  {airport.timezone}
                  <br />
                  <span className="font-light text-xs">
                    (currently:{" "}
                    <LocalizedTimeDisplay timezone={airport.timezone} />)
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </ProtectedRoute>
  );
}
