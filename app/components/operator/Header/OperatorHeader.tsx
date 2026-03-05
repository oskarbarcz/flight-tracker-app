import React, { JSX } from "react";
import { OperatorLogo } from "~/components/operator/Header/OperatorLogo";
import { VerifiedOperatorBadge } from "~/components/operator/VerifiedOperatorBadge";
import { BadgeValueDisplay } from "~/components/shared/Display/BadgeValueDisplay";
import { Operator } from "~/models";

type Props = {
  operator: Operator;
};

export function OperatorHeader({ operator }: Props): JSX.Element {
  return (
    <header className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
      {operator.logoUrl && <OperatorLogo logoUrl={operator.logoUrl} />}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {operator.shortName}
        </h1>
        <div className="flex flex-wrap gap-1.5 items-center">
          <BadgeValueDisplay name="IATA" value={operator.iataCode} />
          <BadgeValueDisplay name="ICAO" value={operator.icaoCode} />
          <BadgeValueDisplay name="CALL" value={operator.callsign} />
          <VerifiedOperatorBadge />
        </div>
      </div>
    </header>
  );
}
