import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import type { AirportOnFlightType } from "~/features/flight";
import { toHuman } from "~/i18n/translate";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type TileAirport = Pick<Airport, "id" | "iataCode" | "name" | "city" | "country" | "shape">;

type Props = {
  airport: TileAirport;
  type?: AirportOnFlightType;
  className?: string;
};

export function AirportTile({ airport, type, className }: Props) {
  return (
    <Link
      to={`/airports-library/${airport.id}`}
      viewTransition
      className={twMerge(
        "flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800",
        className,
      )}
    >
      <OptionAvatarFrame>
        <AirportShape shape={airport.shape} />
      </OptionAvatarFrame>
      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 font-mono text-lg font-bold text-gray-900 dark:text-white">{airport.iataCode}</span>
          <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
          <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{airport.name}</span>
        </span>
        <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
          {airport.city}, {airport.country}
        </span>
      </span>
      {type && <AirportTypeBadge type={type} />}
    </Link>
  );
}

function AirportTypeBadge({ type }: { type: AirportOnFlightType }) {
  return (
    <span className="shrink-0 self-start rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
      {toHuman.airport.onFlightType(type)}
    </span>
  );
}
