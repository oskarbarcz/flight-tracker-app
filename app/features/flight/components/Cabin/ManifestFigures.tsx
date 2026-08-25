import React from "react";
import type { CabinTally, LoadsheetHeadcount, ManifestTally } from "~/features/flight/lib/manifest";
import type { PassengerStatus } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";
import { DataField } from "~/shared/ui/Display/DataField";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { StatBlock } from "~/shared/ui/Display/StatBlock";

type Props = {
  tally: ManifestTally;
  cabins: CabinTally[];
  totalSeats: number | null;
  loadsheet: LoadsheetHeadcount | null;
  status: PassengerStatus | "all";
};

function loadFactor(boarded: number, totalSeats: number): string {
  return `${Math.round((boarded / totalSeats) * 100)}%`;
}

export function ManifestFigures({ tally, cabins, totalSeats, loadsheet, status }: Props) {
  const reconciles = loadsheet === null || loadsheet.passengers === tally.boarded;
  const isFiltered = status !== "all";

  return (
    <div className="flex flex-col gap-3">
      {isFiltered && (
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-500">
          {`These figures count only ${toHuman.flight.passengerStatus(status).toLowerCase()} passengers, not the whole flight.`}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBlock label="Booked" value={tally.booked} />
        <StatBlock label="Boarded" value={tally.boarded} />
        <StatBlock label="No-show" value={tally.noShow} />
        {!isFiltered && totalSeats !== null && (
          <StatBlock label="Load factor" value={loadFactor(tally.boarded, totalSeats)} />
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {!isFiltered && totalSeats !== null && `${tally.boarded} of ${totalSeats} seats occupied. `}
        {loadsheet !== null && (
          <span className={reconciles ? undefined : "font-semibold text-amber-600 dark:text-amber-500"}>
            {`${loadsheet.label} reports ${loadsheet.passengers} passengers.`}
          </span>
        )}
      </p>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>{isFiltered ? "By cabin" : "Boarded by cabin"}</FieldLabel>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {cabins.map((cabin) => (
            <DataField
              key={cabin.cabin}
              label={toHuman.cabinLayout.cabinClass(cabin.cabin)}
              value={cabin.seats === null ? String(cabin.boarded) : `${cabin.boarded} / ${cabin.seats}`}
              mono
            />
          ))}
        </div>
      </div>
    </div>
  );
}
