import React, { type ReactNode } from "react";
import { OperatorFin } from "~/components/operator/OperatorFin";
import { VerifiedOperatorBadge } from "~/components/operator/VerifiedOperatorBadge";
import type { Operator } from "~/models";
import { BadgeValueDisplay } from "~/shared/ui/Display/BadgeValueDisplay";

type Props = {
  operator: Operator;
  actions?: ReactNode;
};

export function OperatorHeader({ operator, actions }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
      <div className="flex size-28 shrink-0 items-center justify-center self-center rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700">
        <OperatorFin operator={operator} className="mix-blend-multiply" />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">{operator.shortName}</h1>
        <div className="flex flex-wrap gap-1.5 items-center">
          <BadgeValueDisplay name="IATA" value={operator.iataCode} />
          <BadgeValueDisplay name="ICAO" value={operator.icaoCode} />
          <BadgeValueDisplay name="CALL" value={operator.callsign} />
          <VerifiedOperatorBadge />
        </div>
      </div>
      {actions && <div className="shrink-0 md:self-start">{actions}</div>}
    </header>
  );
}
