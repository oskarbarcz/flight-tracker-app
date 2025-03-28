"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Operator } from "~/models";
import { Link, useLoaderData } from "react-router";
import { HiPencil } from "react-icons/hi";
import { OperatorService } from "~/state/api/operator.service";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientLoader(): Promise<Operator[]> {
  return new OperatorService().fetchAll();
}

export default function OperatorsListRoute() {
  usePageTitle("Operator list");
  const airports = useLoaderData<Operator[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Airports"
        linkText="Create new"
        linkUrl="/operators/new"
      />
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700">
        <Table>
          <Table.Head className="dark:text-gray-100">
            <Table.HeadCell>ICAO code</Table.HeadCell>
            <Table.HeadCell>Short name</Table.HeadCell>
            <Table.HeadCell>Full name</Table.HeadCell>
            <Table.HeadCell>Callsign</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {airports.map((operator: Operator, i: number) => (
              <Table.Row
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="text-gray-900 dark:text-white">
                  {operator.icaoCode}
                </Table.Cell>
                <Table.Cell>{operator.shortName}</Table.Cell>
                <Table.Cell>{operator.fullName}</Table.Cell>
                <Table.Cell>{operator.callsign}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/operators/${operator.id}/edit`}
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
