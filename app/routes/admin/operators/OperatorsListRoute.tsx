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
          <TableHead className="dark:text-gray-100">
            <TableHeadCell>ICAO code</TableHeadCell>
            <TableHeadCell>Short name</TableHeadCell>
            <TableHeadCell>Full name</TableHeadCell>
            <TableHeadCell>Callsign</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {airports.map((operator: Operator, i: number) => (
              <TableRow
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="text-gray-900 dark:text-white">
                  {operator.icaoCode}
                </TableCell>
                <TableCell>{operator.shortName}</TableCell>
                <TableCell>{operator.fullName}</TableCell>
                <TableCell>{operator.callsign}</TableCell>
                <TableCell>
                  <Link
                    to={`/operators/${operator.id}/edit`}
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
