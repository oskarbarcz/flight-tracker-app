import { Alert } from "flowbite-react";
import React from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { OsmReadProgress } from "~/features/airport/components/Enrichment/OsmReadProgress";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

const COMPARED_RECORDS = ["Boundary", "Location", "Runways", "Terminals", "Parking stands", "Gates"];

type Props = {
  icaoCode: string;
  startedAt: number | null;
  error: string | null;
};

export function OsmPullPrompt({ icaoCode, startedAt, error }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        OpenStreetMap is read for the aerodrome filed under{" "}
        <span className="font-mono font-bold text-gray-900 dark:text-white">{icaoCode}</span> and compared, record by
        record, against what this airport holds today.
      </p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 dark:border-gray-800 dark:bg-gray-900/40">
        {startedAt === null ? (
          <>
            <FieldLabel>Compared</FieldLabel>
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
              {COMPARED_RECORDS.map((record) => (
                <li key={record}>{record}</li>
              ))}
            </ul>
          </>
        ) : (
          <OsmReadProgress
            startedAt={startedAt}
            hint="Overpass answers in its own time and can take a full minute. The review opens the moment it does — leave this window open."
          />
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        The read writes nothing and can take up to a minute — Overpass is a free public service. Every difference it
        finds comes back for review, and only the ones selected are applied.
      </p>

      {error !== null && (
        <Alert color="failure" icon={HiExclamationCircle}>
          {error}
        </Alert>
      )}
    </div>
  );
}
