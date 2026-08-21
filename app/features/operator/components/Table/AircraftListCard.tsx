import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router";
import type { Aircraft } from "~/features/aircraft";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import { aircraftStateColors } from "~/features/aircraft/i18n";
import { formatWeightCategory } from "~/features/airframe/lib/formatAirframe";
import type { Airport } from "~/features/airport";
import { toHuman } from "~/i18n/translate";
import { DataField } from "~/shared/ui/Display/DataField";

type Props = {
  aircraft: Aircraft;
  operatorId: string;
  baseAirport: Airport | null;
};

export function AircraftListCard({ aircraft, operatorId, baseAirport }: Props) {
  return (
    <Link
      to={`/operators/${operatorId}/aircraft/${aircraft.id}`}
      viewTransition
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
    >
      <div className="flex items-start gap-3">
        <AircraftIcon type={aircraft.airframe.type} name={aircraft.airframe.name} />
        <div className="min-w-0 flex-1">
          <span className="block truncate font-mono text-lg font-bold text-gray-900 dark:text-white">
            {aircraft.registration}
          </span>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{aircraft.airframe.name}</span>
        </div>
        <Badge color={aircraftStateColors[aircraft.currentState]} size="sm" className="shrink-0">
          {toHuman.aircraft.state(aircraft.currentState)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        <DataField label="Base" value={baseAirport?.iataCode ?? "—"} mono />
        <DataField label="SELCAL" value={aircraft.selcal || "—"} mono />
        <DataField label="Wake" value={formatWeightCategory(aircraft.airframe.weightCategory)} />
      </div>

      <span className="flex items-center gap-1.5 text-sm font-bold text-primary-500">
        <span className="truncate">{aircraft.livery}</span>
        <HiOutlineArrowRight className="ml-auto size-4 shrink-0" />
      </span>
    </Link>
  );
}
