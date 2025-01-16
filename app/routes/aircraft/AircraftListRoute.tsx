"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Aircraft } from "~/models";
import { Link, redirect, useLoaderData } from "react-router";
import { HiPencil } from "react-icons/hi";
import { AircraftService } from "~/state/services/aircraft.service";

export async function clientLoader(): Promise<Aircraft[] | Response> {
  return AircraftService.getAll().catch(() => redirect("/sign-in"));
}

export default function AircraftListRoute() {
  const aircrafts = useLoaderData<Aircraft[]>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Aircrafts"
          linkText="Create new"
          linkUrl="/aircraft/new"
        />

        <Table className="shadow">
          <Table.Head>
            <Table.HeadCell>ICAO code</Table.HeadCell>
            <Table.HeadCell>Registration</Table.HeadCell>
            <Table.HeadCell>Short name</Table.HeadCell>
            <Table.HeadCell>Long name</Table.HeadCell>
            <Table.HeadCell>Livery</Table.HeadCell>
            <Table.HeadCell>SELCAL</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {aircrafts.map((aircraft: Aircraft, i: number) => (
              <Table.Row
                key={i}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {aircraft.icaoCode}
                </Table.Cell>
                <Table.Cell>{aircraft.registration}</Table.Cell>
                <Table.Cell>{aircraft.shortName}</Table.Cell>
                <Table.Cell>{aircraft.fullName}</Table.Cell>
                <Table.Cell>{aircraft.livery}</Table.Cell>
                <Table.Cell>{aircraft.selcal}</Table.Cell>
                <Table.Cell>
                  <Button color="gray">
                    <Link to={`/aircraft/${aircraft.id}/edit`} replace>
                      <HiPencil />
                    </Link>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </ProtectedRoute>
  );
}
