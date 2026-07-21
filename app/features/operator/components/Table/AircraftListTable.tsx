import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useMemo } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router";
import type { Aircraft } from "~/features/aircraft";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import { AircraftAirportRow } from "~/features/aircraft/components/AircraftDetails/AircraftAirportRow";
import {
  formatCruiseSpeed,
  formatPerformanceCode,
  formatServiceCeiling,
  formatWeightCategory,
} from "~/features/airframe/lib/formatAirframe";
import type { Airport } from "~/features/airport";

type Props = {
  operatorId: string;
  aircraft: Aircraft[];
  airports: Airport[];
};

export function AircraftListTable({ operatorId, aircraft, airports }: Props) {
  const airportsById = useMemo(() => new Map(airports.map((airport) => [airport.id, airport])), [airports]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Registration</TableHeadCell>
          <TableHeadCell>SELCAL</TableHeadCell>
          <TableHeadCell>Performance</TableHeadCell>
          <TableHeadCell>Base</TableHeadCell>
          <TableHeadCell>Livery</TableHeadCell>
          <TableHeadCell>Actions</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {aircraft.map((each: Aircraft) => {
          const baseAirport = each.baseAirport ? (airportsById.get(each.baseAirport.id) ?? null) : null;

          return (
            <TableRow key={each.id}>
              <TableCell className="text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-3">
                  <AircraftIcon type={each.airframe.type} name={each.airframe.name} />
                  <div>
                    <Link
                      to={`/operators/${operatorId}/aircraft/${each.id}`}
                      viewTransition
                      className="block font-mono text-lg font-bold hover:text-primary-500"
                    >
                      {each.registration}
                    </Link>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{each.airframe.name}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-gray-500 dark:text-gray-400">{each.selcal || "—"}</TableCell>
              <TableCell>
                <span className="block font-bold">
                  {formatWeightCategory(each.airframe.weightCategory)} ·{" "}
                  {formatPerformanceCode(each.airframe.performanceCode)}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {formatCruiseSpeed(each.airframe.cruiseSpeed)} · {formatServiceCeiling(each.airframe.serviceCeiling)}
                </span>
              </TableCell>
              <TableCell>
                {baseAirport ? <AircraftAirportRow airport={baseAirport} /> : <span className="text-gray-400">—</span>}
              </TableCell>
              <TableCell>{each.livery}</TableCell>
              <TableCell>
                <Link
                  className="inline-flex items-center gap-1.5 text-primary-500 font-bold"
                  to={`/operators/${operatorId}/aircraft/${each.id}`}
                  viewTransition
                >
                  <span>View details</span>
                  <HiOutlineArrowRight className="size-4" />
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
