"use client";

import { Button } from "flowbite-react";
import React, { type JSX } from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import type { Operator } from "~/models";

type Props = {
  operator: Operator;
  type: string | null;
  changeType: (type: string | null) => void;
};

export default function FleetControls({ operator, type, changeType }: Props): JSX.Element {
  const availableTypes = operator.fleetTypes.sort((a, b) => a.localeCompare(b));

  const active =
    "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-300 hover:dark:border-gray-800 focus:ring-0";
  const inactive =
    "rounded-2xl text-gray-500 border border-gray-200 dark:border-gray-800 hover:border-gray-300 hover:dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:ring-0";
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 mb-6">
      <div className="flex flex-wrap self-start gap-1.5">
        <Button
          size="xs"
          color="alternative"
          className={type === null ? active : inactive}
          onClick={() => changeType(null)}
        >
          All types
        </Button>
        {availableTypes.map((each: string) => (
          <Button
            size="xs"
            key={each}
            color="alternative"
            className={type === each ? active : inactive}
            onClick={() => changeType(each)}
          >
            {each}
          </Button>
        ))}
      </div>

      <Button
        className="shrink-0 self-end"
        color="indigo"
        as={Link}
        to={`/operators/${operator.id}/aircraft/add`}
        size="sm"
      >
        <HiPlus />
        <span className="ml-2">Add aircraft</span>
      </Button>
    </div>
  );
}
