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
      <SectionHeaderWithLink
        sectionTitle="Aircrafts"
        linkText="Create new"
        linkUrl="/aircraft/new"
      />
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700">
        <Table className="shadow">
          <TableHead className="dark:text-gray-100">
            <TableHeadCell>ICAO code</TableHeadCell>
            <TableHeadCell>Registration & livery</TableHeadCell>
            <TableHeadCell>Short name</TableHeadCell>
            <TableHeadCell>Long name</TableHeadCell>
            <TableHeadCell>Operator</TableHeadCell>
            <TableHeadCell>SELCAL</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Actions</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {aircrafts.map((aircraft: Aircraft, i: number) => (
              <TableRow
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="text-gray-900 dark:text-white">
                  {aircraft.icaoCode}
                </TableCell>
                <TableCell>
                  <span>{aircraft.registration}</span>
                  <span className="block">{aircraft.livery}</span>
                </TableCell>
                <TableCell>{aircraft.shortName}</TableCell>
                <TableCell>{aircraft.fullName}</TableCell>
                <TableCell>
                  <span>{aircraft.operator.shortName}</span>
                  <span className="block">[{aircraft.operator.icaoCode}]</span>
                </TableCell>
                <TableCell>{aircraft.selcal}</TableCell>
                <TableCell>
                  <Link
                    to={`/aircraft/${aircraft.id}/edit`}
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
