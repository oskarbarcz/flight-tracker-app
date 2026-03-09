import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import { formatDateToLocal } from "~/functions/time";
import type { GetRotationResponse } from "~/state/api/request/operator.request";

type Props = {
  operatorId: string;
  rotations: GetRotationResponse[];
  removeRotation: (rotationId: GetRotationResponse) => void;
};

export function RotationListTable({ operatorId, rotations, removeRotation }: Props) {
  return (
    <Table className="shadow">
      <TableHead>
        <TableRow>
          <TableHeadCell>Rotation name</TableHeadCell>
          <TableHeadCell>Legs</TableHeadCell>
          <TableHeadCell>Captain</TableHeadCell>
          <TableHeadCell>History</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {rotations.map((rotation: GetRotationResponse) => (
          <TableRow key={rotation.id}>
            <TableCell>{rotation.name}</TableCell>
            <TableCell>
              {rotation.flights.length > 0 ? (
                <span className="text-wrap">
                  {rotation.flights.map(
                    (flight, idx) => flight.flightNumber + (idx < rotation.flights.length - 1 ? ", " : ""),
                  )}
                </span>
              ) : (
                <span className="text-gray-500">No legs yet added.</span>
              )}
            </TableCell>
            <TableCell>
              <div>
                <span className="block text-gray-900 dark:text-white">{rotation.pilot.name}</span>
                <span className="text-xs text-gray-500">License: {rotation.pilot.pilotLicenseId}</span>
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
                  <span className="text-gray-500">Not changed since created.</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="block text-primary-500 font-bold">
                <Link className="block" to={`/operators/${operatorId}/rotations/${rotation.id}/edit`} viewTransition>
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => removeRotation(rotation)}
                  className="mt-1 cursor-pointer text-red-500 dark:text-red-800"
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
