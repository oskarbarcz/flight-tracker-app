import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import {
  type AircraftHoldLayout,
  compartmentsOf,
  defaultVariantOf,
  positionCountOf,
} from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  layouts: AircraftHoldLayout[];
};

export function HoldCatalogueTable({ layouts }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Variants</TableHeadCell>
              <TableHeadCell>Decks</TableHeadCell>
              <TableHeadCell className="text-end">Compartments</TableHeadCell>
              <TableHeadCell className="text-end">Positions</TableHeadCell>
              <TableHeadCell className="text-end">Volume</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {layouts.map((layout) => {
              const variant = defaultVariantOf(layout);
              const compartments = variant === null ? [] : compartmentsOf(variant);
              const volume = compartments.reduce((sum, compartment) => sum + compartment.volumeM3, 0);

              return (
                <TableRow key={layout.type}>
                  <TableCell className="font-mono font-medium text-gray-900 dark:text-white">
                    <Link to={`/cargo-holds/${layout.type}`} viewTransition className="hover:text-primary-500">
                      {layout.type}
                    </Link>
                  </TableCell>
                  <TableCell>{layout.variants.map((entry) => entry.id).join(", ")}</TableCell>
                  <TableCell>
                    {variant === null
                      ? "—"
                      : variant.decks.map((deck) => toHuman.cargoHold.deck(deck.deck)).join(" + ")}
                  </TableCell>
                  <TableCell className="text-end font-mono tabular-nums">{compartments.length}</TableCell>
                  <TableCell className="text-end font-mono tabular-nums">
                    {variant === null ? 0 : positionCountOf(variant)}
                  </TableCell>
                  <TableCell className="text-end font-mono tabular-nums">{Math.round(volume * 10) / 10} m³</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
