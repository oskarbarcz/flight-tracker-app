import React from "react";
import type { Operator } from "~/features/operator";
import { OperatorSpecStrip } from "~/features/operator/components/Header/OperatorSpecStrip";
import { OperatorFinPlate } from "~/features/operator/components/OperatorFinPlate";
import { VerifiedOperatorBadge } from "~/features/operator/components/VerifiedOperatorBadge";

type Props = {
  operator: Operator;
};

export function OperatorHeader({ operator }: Props) {
  return (
    <header className="relative">
      <div className="flex items-end gap-5 border-b border-gray-200 pb-5 dark:border-gray-700">
        <OperatorFinPlate operator={operator} className="size-24 sm:size-28 lg:size-32" />

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl xl:text-5xl">
            {operator.shortName}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{operator.fullName}</p>
            <VerifiedOperatorBadge />
          </div>
        </div>
      </div>

      <OperatorSpecStrip operator={operator} className="pt-4" />
    </header>
  );
}
