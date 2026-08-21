import React from "react";
import { twMerge } from "tailwind-merge";
import type { Operator } from "~/features/operator";
import { toHuman } from "~/i18n/translate";
import { DataField } from "~/shared/ui/Display/DataField";

type Props = {
  operator: Operator;
  className?: string;
};

function formatHubs(hubs: string[]): string {
  if (hubs.length === 0) {
    return "—";
  }
  return hubs.length > 3 ? `${hubs.slice(0, 3).join(", ")} +${hubs.length - 3}` : hubs.join(", ");
}

export function OperatorSpecStrip({ operator, className }: Props) {
  return (
    <div className={twMerge("grid min-w-0 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-7", className)}>
      <DataField label="IATA" value={operator.iataCode} mono />
      <DataField label="ICAO" value={operator.icaoCode} mono />
      <DataField label="Callsign" value={operator.callsign} mono />
      <DataField label="Hubs" value={formatHubs(operator.hubs)} mono />
      <DataField label="Fleet size" value={`${operator.fleetSize} aircraft`} />
      <DataField label="Avg fleet age" value={`${operator.avgFleetAge} years`} />
      <DataField label="Region" value={toHuman.airport.continent(operator.continent)} />
    </div>
  );
}
