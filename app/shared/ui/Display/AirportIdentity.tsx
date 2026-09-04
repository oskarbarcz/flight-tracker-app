import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import type { Coordinates } from "~/shared/models/coordinates";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  shape: Coordinates[] | null;
  href?: string;
  size?: "md" | "lg";
};

export function AirportIdentity({ iataCode, name, city, country, shape, href, size = "lg" }: Props) {
  const codeClassName = twMerge(
    "shrink-0 font-mono font-bold text-gray-900 dark:text-white",
    size === "lg" ? "text-lg" : "text-sm",
  );

  return (
    <div className="flex items-center gap-3">
      <OptionAvatarFrame>
        <AirportShape shape={shape} />
      </OptionAvatarFrame>
      <div className="min-w-0">
        <div className="flex min-w-0 items-baseline gap-2">
          {href ? (
            <Link to={href} viewTransition className={twMerge(codeClassName, "hover:text-primary-500")}>
              {iataCode}
            </Link>
          ) : (
            <span className={codeClassName}>{iataCode}</span>
          )}
          <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
          <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{name}</span>
        </div>
        <div className="truncate text-sm text-gray-500 dark:text-gray-400">
          {city}, {country}
        </div>
      </div>
    </div>
  );
}
