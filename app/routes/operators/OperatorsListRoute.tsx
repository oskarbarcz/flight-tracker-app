"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Operator } from "~/models";
import { Link, redirect, useLoaderData } from "react-router";
import { HiPencil } from "react-icons/hi";
import { OperatorService } from "~/state/services/operator.service";

export async function clientLoader(): Promise<Operator[] | Response> {
  return OperatorService.fetchAll().catch(() => redirect("/sign-in"));
}

export default function OperatorsListRoute() {
  const airports = useLoaderData<Operator[]>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="pb-4">
        <SectionHeaderWithLink
          sectionTitle="Airports"
          linkText="Create new"
          linkUrl="/operators/new"
        />

        <Table className="shadow">
          <Table.Head>
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
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {operator.icaoCode}
                </Table.Cell>
                <Table.Cell>{operator.shortName}</Table.Cell>
                <Table.Cell>{operator.fullName}</Table.Cell>
                <Table.Cell>{operator.callsign}</Table.Cell>
                <Table.Cell>
                  <Button color="gray">
                    <Link to={`/operators/${operator.id}/edit`} replace>
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
