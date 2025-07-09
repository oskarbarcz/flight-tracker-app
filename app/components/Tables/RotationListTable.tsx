import { RotationResponse } from "~/models";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import React from "react";
import { formatDateToLocal } from "~/functions/time";
import { FaTrash } from "react-icons/fa";

type RotationListTableProps = {
  rotations: RotationResponse[];
  removeRotation: (rotationId: RotationResponse) => void;
};

export default function RotationListTable({
  rotations,
  removeRotation,
}: RotationListTableProps) {
  return (
    <Table className="shadow">
      <TableHead className="dark:text-gray-100">
        <TableHeadCell>Rotation name</TableHeadCell>
        <TableHeadCell>Legs</TableHeadCell>
        <TableHeadCell>Pilot ID</TableHeadCell>
        <TableHeadCell>History</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Actions</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {rotations.map((rotation: RotationResponse, i: number) => (
          <TableRow key={i} className="dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="text-gray-900 dark:text-white">
              {rotation.name}
            </TableCell>
            <TableCell>
              {rotation.flights.length > 0 ? (
                <span className="text-wrap">
                  {rotation.flights.map(
                    (flight, idx) =>
                      flight.flightNumber +
                      (idx < rotation.flights.length - 1 ? ", " : ""),
                  )}
                </span>
              ) : (
                <span className="text-gray-500">No legs yet added.</span>
              )}
            </TableCell>
            <TableCell>
              <div>
                <span className="block text-gray-900 dark:text-white">
                  {rotation.pilot.name}
                </span>
                <span className="text-xs text-gray-500">
                  License: {rotation.pilot.pilotLicenseId}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <span className="block text-gray-900 dark:text-white">
                  <span>Created on </span>
                  {formatDateToLocal(new Date(rotation.createdAt))}
                </span>
                {rotation.updatedAt ? (
                  <span className="text-xs text-gray-500">
                    <span>Last changed on </span>
                    {formatDateToLocal(new Date(rotation.updatedAt))}
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Not changed since created.
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2 text-gray-500">
                <Link
                  to={`/rotations/${rotation.id}/edit`}
                  replace
                  viewTransition
                >
                  <Button color="gray">
                    <HiPencil />
                  </Button>
                </Link>
                <Button
                  onClick={() => removeRotation(rotation)}
                  color="failure"
                  size="xs"
                  className="flex cursor-pointer items-center"
                >
                  <FaTrash />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
