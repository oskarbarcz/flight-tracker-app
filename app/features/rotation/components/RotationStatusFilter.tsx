import React from "react";
import { Link } from "react-router";
import { RotationStatus } from "~/features/rotation";
import { toHuman } from "~/i18n/translate";

export type RotationStatusFilterValue = RotationStatus | "all";

const STATUS_ORDER: RotationStatusFilterValue[] = [
  "all",
  RotationStatus.Draft,
  RotationStatus.Ready,
  RotationStatus.InProgress,
  RotationStatus.Finished,
];

function label(value: RotationStatusFilterValue): string {
  return value === "all" ? "All" : toHuman.rotation.status(value);
}

type Props = {
  active: RotationStatusFilterValue;
};

export function RotationStatusFilter({ active }: Props) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      {STATUS_ORDER.map((value) => {
        const isActive = value === active;
        return (
          <Link
            key={value}
            to={`?status=${value}`}
            viewTransition
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-300"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {label(value)}
          </Link>
        );
      })}
    </div>
  );
}
