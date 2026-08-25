import type { IconType } from "react-icons";
import { acceptedTypes } from "~/features/cargo-hold/lib/positionFit";
import type { HoldPosition } from "~/features/cargo-hold/model";
import { PositionSide, UldBase } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

export type PositionMarker = {
  key: string;
  label: string;
  icon: IconType;
};

export type DetailRow = {
  label: string;
  value: string;
};

export type PositionAppearance = {
  fill: string;
  description: string;
  markers?: PositionMarker[];
  detail?: DetailRow[];
};

export type LegendEntry = {
  key: string;
  fill: string;
  label: string;
};

export type HoldReading = {
  key: string;
  label: string;
  appearanceOf: (position: HoldPosition) => PositionAppearance;
  legendFor: (positions: HoldPosition[]) => LegendEntry[];
  note?: string | null;
};

const CONTAINER_FILL = "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700";
const PALLET_FILL = "border-gray-400 bg-gray-200 dark:border-gray-500 dark:bg-gray-600";

export function isPalletPosition(position: HoldPosition): boolean {
  return position.acceptedBases.some((base) => base === UldBase.A || base === UldBase.M);
}

export function describePosition(position: HoldPosition): string {
  const types = acceptedTypes(position);
  const fits = types.length === 0 ? "no catalogued device" : types.join(", ");
  const side = toHuman.cargoHold.positionSide(position.side);
  return `Position ${position.designator}, ${side.toLowerCase()}, accepts ${fits}, up to ${position.maxWeightKg} kg`;
}

export const acceptedReading: HoldReading = {
  key: "accepted",
  label: "What the position accepts",
  appearanceOf: (position) => ({
    fill: isPalletPosition(position) ? PALLET_FILL : CONTAINER_FILL,
    description: describePosition(position),
  }),
  legendFor: (positions) => {
    const entries: LegendEntry[] = [];
    if (positions.some((position) => !isPalletPosition(position))) {
      entries.push({ key: "container", fill: CONTAINER_FILL, label: "Container position" });
    }
    if (positions.some(isPalletPosition)) {
      entries.push({ key: "pallet", fill: PALLET_FILL, label: "Pallet position" });
    }
    return entries;
  },
};

export function pairLabel(position: HoldPosition): string {
  return position.side === PositionSide.Full ? "Full width" : position.side;
}
