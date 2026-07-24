import { Button } from "flowbite-react";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import type { Operator } from "~/features/operator";

type Props = {
  operator: Operator;
  type: string | null;
  changeType: (type: string | null) => void;
};

export function FleetControls({ operator, type, changeType }: Props) {
  const values: (string | null)[] = [null, ...[...operator.fleetTypes].sort((a, b) => a.localeCompare(b))];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {values.map((value) => {
          const isActive = value === type;
          return (
            <button
              key={value ?? "all"}
              type="button"
              onClick={() => changeType(value)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold ${
                isActive
                  ? "bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {value ?? "All types"}
            </button>
          );
        })}
      </div>

      <Button
        size="xs"
        className="ms-auto w-fit"
        color="indigo"
        as={Link}
        to={`/operators/${operator.id}/aircraft/add`}
      >
        <HiPlus />
        <span className="ml-2">Add aircraft</span>
      </Button>
    </div>
  );
}
