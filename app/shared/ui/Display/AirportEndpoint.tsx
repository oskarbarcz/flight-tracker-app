import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  iataCode: string;
  name?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "md" | "lg";
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function AirportEndpoint({ iataCode, name, subtitle, align = "left", size = "md" }: Props) {
  return (
    <div className={twMerge("min-w-0", alignClass[align])}>
      <span
        className={twMerge(
          "block font-mono font-bold leading-none text-gray-900 dark:text-white",
          size === "lg" ? "text-3xl" : "text-2xl",
        )}
      >
        {iataCode}
      </span>
      {name && <span className="mt-1 block truncate text-sm font-bold text-gray-700 dark:text-gray-200">{name}</span>}
      {subtitle && <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>}
    </div>
  );
}
