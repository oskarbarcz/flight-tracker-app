import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { acceptedTypes } from "~/features/cargo-hold/lib/positionFit";
import { CompartmentLoading, type HoldDeck } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  deck: HoldDeck;
  id?: string;
  query?: string;
};

export function HoldPositionTable({ deck, id, query = "" }: Props) {
  const needle = query.trim().toUpperCase();
  const matches = (designator: string) => needle === "" || designator.includes(needle);

  const rows = deck.compartments.flatMap((compartment) =>
    compartment.loading === CompartmentLoading.Loose
      ? needle === ""
        ? [
            <TableRow key={`${deck.deck}-${compartment.number}-loose`}>
              <TableCell className="font-mono font-medium text-gray-500 dark:text-gray-400">—</TableCell>
              <TableCell className="font-mono tabular-nums">{compartment.number}</TableCell>
              <TableCell colSpan={4} className="text-gray-500 dark:text-gray-400">
                Loosely loaded · {compartment.volumeM3} m³ usable
              </TableCell>
              <TableCell className="text-end font-mono tabular-nums">
                {compartment.maxWeightKg.toLocaleString()} kg
              </TableCell>
            </TableRow>,
          ]
        : []
      : compartment.positions
          .filter((position) => matches(position.designator))
          .map((position) => {
            const fits = acceptedTypes(position);
            return (
              <TableRow key={`${deck.deck}-${position.designator}`}>
                <TableCell className="font-mono font-medium text-gray-900 dark:text-white">
                  {position.designator}
                </TableCell>
                <TableCell className="font-mono tabular-nums">{position.compartment}</TableCell>
                <TableCell>{toHuman.cargoHold.positionSide(position.side)}</TableCell>
                <TableCell className="font-mono">{position.acceptedBases.join(" ")}</TableCell>
                <TableCell className="font-mono">{position.acceptedContours.join(" ")}</TableCell>
                <TableCell className="font-mono">
                  {fits.length === 0 ? "No catalogued device" : fits.join(" ")}
                </TableCell>
                <TableCell className="text-end font-mono tabular-nums">
                  {position.maxWeightKg.toLocaleString()} kg
                </TableCell>
              </TableRow>
            );
          }),
  );

  if (rows.length === 0) {
    return (
      <p
        id={id}
        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        No position matches that search.
      </p>
    );
  }

  return (
    <div id={id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Position</TableHeadCell>
              <TableHeadCell>Compartment</TableHeadCell>
              <TableHeadCell>Side</TableHeadCell>
              <TableHeadCell>Bases</TableHeadCell>
              <TableHeadCell>Contours</TableHeadCell>
              <TableHeadCell>Accepts</TableHeadCell>
              <TableHeadCell className="text-end">Max weight</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">{rows}</TableBody>
        </Table>
      </div>
    </div>
  );
}
