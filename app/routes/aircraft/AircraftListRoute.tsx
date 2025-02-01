"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Aircraft } from "~/models";
import { Link, useLoaderData } from "react-router";
import { HiPencil } from "react-icons/hi";
import { AircraftService } from "~/state/api/aircraft.service";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientLoader(): Promise<Aircraft[]> {
  return new AircraftService().getAll();
}

export default function AircraftListRoute() {
  usePageTitle("Aircraft list");
  const aircrafts = useLoaderData<Aircraft[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Aircrafts"
          linkText="Create new"
          linkUrl="/aircraft/new"
        />

        <Table className="shadow">
          <Table.Head>
            <Table.HeadCell>ICAO code</Table.HeadCell>
            <Table.HeadCell>Registration & livery</Table.HeadCell>
            <Table.HeadCell>Short name</Table.HeadCell>
            <Table.HeadCell>Long name</Table.HeadCell>
            <Table.HeadCell>Operator</Table.HeadCell>
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
                <Table.Cell>
                  <span>{aircraft.registration}</span>
                  <span className="block">{aircraft.livery}</span>
                </Table.Cell>
                <Table.Cell>{aircraft.shortName}</Table.Cell>
                <Table.Cell>{aircraft.fullName}</Table.Cell>
                <Table.Cell>
                  <span>{aircraft.operator.shortName}</span>
                  <span className="block">[{aircraft.operator.icaoCode}]</span>
                </Table.Cell>
                <Table.Cell>{aircraft.selcal}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/aircraft/${aircraft.id}/edit`}
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
