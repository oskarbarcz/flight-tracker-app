import React from "react";
import type { NotocDrill } from "~/features/notoc/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  drill: NotocDrill;
};

export function DrillCard({ drill }: Props) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-gray-50 px-3 py-3 dark:bg-gray-800">
      <div className="flex flex-col gap-0.5">
        <FieldLabel>Emergency response code</FieldLabel>
        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{drill.ercCode}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <FieldLabel>Inherent risk</FieldLabel>
        <p className="text-sm text-gray-700 dark:text-gray-200">{drill.inherentRisk}</p>
      </div>

      <div className="flex flex-col gap-0.5">
        <FieldLabel>Risk to aircraft and occupants</FieldLabel>
        <p className="text-sm text-gray-700 dark:text-gray-200">{drill.riskToAircraftAndOccupants}</p>
      </div>

      <div className="flex flex-col gap-0.5">
        <FieldLabel>Spill and fire procedure</FieldLabel>
        <p className="text-sm text-gray-700 dark:text-gray-200">{drill.spillAndFireProcedure}</p>
      </div>

      <div className="flex flex-col gap-0.5">
        <FieldLabel>Additional risks</FieldLabel>
        <ul className="flex flex-col gap-1">
          {drill.additionalRisks.map((risk) => (
            <li key={risk} className="text-sm text-gray-700 dark:text-gray-200">
              {risk}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
