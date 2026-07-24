import React from "react";
import type { Airport } from "~/features/airport";
import { airportSelectOptions } from "~/features/airport/components/Airport/airportSelectOptions";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { ManagedDateTimeInputBlock } from "~/shared/ui/Form/Managed/ManagedDateTimeInputBlock";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";

type Props = {
  airports: Airport[];
};

export function LegFormFields({ airports }: Props) {
  const options = airportSelectOptions(airports);

  return (
    <div className="flex flex-col gap-1">
      <ManagedInputBlock field="flightNumber" label="Flight number" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AdvancedSelect field="departureId" label="Departure" options={options} placeholder="Select departure…" />
        <AdvancedSelect field="arrivalId" label="Arrival" options={options} placeholder="Select arrival…" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ManagedDateTimeInputBlock field="offBlockTime" label="Off-block time [zulu]" autoComplete="off" />
        <ManagedDateTimeInputBlock field="onBlockTime" label="On-block time [zulu]" autoComplete="off" />
      </div>
    </div>
  );
}
