import React from "react";
import { BuildUpLine } from "~/features/flight/components/FuelAndLoadsheet/BuildUpLine";

type Props = {
  zeroFuelWeight: number;
  blockFuel: number;
};

export function WeightsBuildUp({ zeroFuelWeight, blockFuel }: Props) {
  return (
    <div>
      <BuildUpLine label="Actual ZFW" value={zeroFuelWeight} />
      <BuildUpLine label="Actual block fuel" value={blockFuel} addition />
      <BuildUpLine label="Gross takeoff weight" value={zeroFuelWeight + blockFuel} total />
    </div>
  );
}
