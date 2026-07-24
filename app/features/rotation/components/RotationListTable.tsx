import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import type { Rotation } from "~/features/rotation";
import { RotationStatusBadge } from "~/features/rotation/components/RotationStatusBadge";
import { formatDate } from "~/shared/lib/time";

type Props = {
  operatorId: string;
  rotations: Rotation[];
  pilotNames: Record<string, string>;
};

function departureDate(rotation: Rotation): string {
  const first = rotation.legs[0];
  return first ? formatDate(first.offBlockTime).split(" ")[0] : "—";
}

export function RotationListTable({ operatorId, rotations, pilotNames }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Legs</TableHeadCell>
          <TableHeadCell>Departure date</TableHeadCell>
          <TableHeadCell>Captain</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {rotations.map((rotation) => {
          const detailsPath = `/operators/${operatorId}/rotations/${rotation.id}`;
          return (
            <TableRow key={rotation.id} className="bg-white dark:bg-gray-900">
              <TableCell className="text-lg font-bold text-gray-900 dark:text-white">
                <Link to={detailsPath} viewTransition className="hover:text-primary-500">
                  {rotation.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="block text-xs text-gray-500">
                  {rotation.legs.length} {rotation.legs.length === 1 ? "leg" : "legs"}
                </span>
                {rotation.legs.length > 0 && (
                  <span className="mt-0.5 block font-mono text-sm">
                    {rotation.legs.map((leg, index) => (
                      <React.Fragment key={leg.id}>
                        {index > 0 && <span className="text-gray-400">, </span>}
                        <Link
                          to={detailsPath}
                          viewTransition
                          className="font-semibold text-gray-900 hover:text-primary-500 dark:text-white"
                        >
                          {leg.flightNumber}
                        </Link>
                      </React.Fragment>
                    ))}
                  </span>
                )}
              </TableCell>
              <TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {departureDate(rotation)}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">{pilotNames[rotation.pilotId] ?? "—"}</TableCell>
              <TableCell>
                <RotationStatusBadge status={rotation.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
