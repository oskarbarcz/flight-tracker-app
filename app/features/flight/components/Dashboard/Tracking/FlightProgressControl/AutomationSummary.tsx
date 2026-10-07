import React from "react";
import { LuCheck, LuTriangleAlert } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import type { AutomationCondition, AutomationState } from "~/features/flight/lib/flightAutomation";

function Condition({ condition }: { condition: AutomationCondition }) {
  const Icon = condition.ok ? LuCheck : LuTriangleAlert;

  return (
    <li
      className={twMerge(
        "flex items-center gap-2 font-semibold",
        condition.ok ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400",
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden={true} />
      {condition.text}
    </li>
  );
}

export function AutomationSummary({ state }: { state: AutomationState }) {
  return (
    <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
      <p className="font-semibold">{state.title}</p>
      <p>{state.description}</p>
      <ul className="mt-0.5 flex flex-col gap-1">
        {state.conditions.map((condition) => (
          <Condition key={condition.text} condition={condition} />
        ))}
      </ul>
    </div>
  );
}
