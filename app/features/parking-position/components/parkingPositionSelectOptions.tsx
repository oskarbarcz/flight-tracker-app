import React from "react";
import { gateLocationOptions, NoiseSensitivity, type ParkingPosition } from "~/features/parking-position";
import { groupParkingPositionsByTerminal } from "~/features/parking-position/lib/parkingPositionGroups";
import type { Terminal } from "~/features/terminal";
import type { AdvancedSelectOption } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function parkingPositionSelectOptions(
  parkingPositions: ParkingPosition[],
  terminals: Terminal[],
): AdvancedSelectOption[] {
  return groupParkingPositionsByTerminal(parkingPositions, terminals).flatMap((group) => {
    const terminalLabel = group.terminal?.fullName ?? "Unassigned";
    return group.parkingPositions.map((parkingPosition) => {
      const locationLabel = labelOf(gateLocationOptions, parkingPosition.location);
      const details = `${terminalLabel} · ${locationLabel}`;
      return {
        value: parkingPosition.id,
        keywords: [parkingPosition.name, group.terminal?.shortName, group.terminal?.fullName, locationLabel].filter(
          (keyword): keyword is string => Boolean(keyword),
        ),
        title: parkingPosition.name,
        subtitle: parkingPosition.noiseSensitivity === NoiseSensitivity.Yes ? `${details} · Noise sensitive` : details,
        selectedSubtitle: details,
      };
    });
  });
}
