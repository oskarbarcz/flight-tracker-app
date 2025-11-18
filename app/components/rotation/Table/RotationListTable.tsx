import { RotationResponse } from "~/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router";
import React from "react";
import { formatDateToLocal } from "~/functions/time";

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
        <TableRow>
          <TableHeadCell>Rotation name</TableHeadCell>
          <TableHeadCell>Legs</TableHeadCell>
          <TableHeadCell>Captain</TableHeadCell>
          <TableHeadCell>History</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
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
              <div className="block text-primary-500 font-bold">
                <Link
                  className="block"
                  to={`/rotations/${rotation.id}/edit`}
                  replace
                  viewTransition
                >
                  Edit
                </Link>
                <button
                  onClick={() => removeRotation(rotation)}
                  className="mt-1 cursor-pointer text-red-500"
                >
                  Remove
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
