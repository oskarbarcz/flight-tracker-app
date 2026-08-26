import React from "react";
import { DataField } from "~/shared/ui/Display/DataField";

type Props = {
  position: string | null;
  compartment: number | null;
  hasCuratedHold: boolean;
};

export function NotocPosition({ position, compartment, hasCuratedHold }: Props) {
  if (position !== null) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
        <DataField label="Position" value={position} mono />
        <DataField label="Compartment" value={compartment === null ? "Not reported" : String(compartment)} mono />
      </div>
    );
  }

  return (
    <p className="text-xs text-gray-500 dark:text-gray-400">
      {hasCuratedHold
        ? "Loaded loose, so the notification reports no position for it."
        : "This airframe type carries no curated hold data, so the notification reports no position."}
    </p>
  );
}
