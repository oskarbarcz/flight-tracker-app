import React from "react";
import { FaCheck, FaTriangleExclamation } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import type { AutomationCondition, AutomationState } from "~/features/flight/lib/flightAutomation";

function Condition({ condition }: { condition: AutomationCondition }) {
  const Icon = condition.ok ? FaCheck : FaTriangleExclamation;

  return (
    <span
      className={twMerge(
        "flex items-center gap-2 text-xs font-semibold",
        condition.ok ? "text-green-300" : "text-amber-300",
      )}
    >
      <Icon size={11} className="shrink-0" aria-hidden={true} />
      {condition.text}
    </span>
  );
}

export function AutomationSummary({ state }: { state: AutomationState }) {
  return (
    <div className="flex max-w-64 flex-col gap-1.5 whitespace-normal text-left">
      <p className="text-sm font-semibold">{state.title}</p>
      <p className="text-xs font-normal opacity-90">{state.description}</p>
      <div className="mt-0.5 flex flex-col gap-1">
        {state.conditions.map((condition) => (
          <Condition key={condition.text} condition={condition} />
        ))}
      </div>
    </div>
  );
}
