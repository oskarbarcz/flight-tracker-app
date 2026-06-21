import { Badge } from "flowbite-react";
import React from "react";
import { categoryLabel, threatLevelLabel, urgencyLabel } from "~/components/flight/Dashboard/Emergency/emergencyLabels";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { UserName } from "~/components/shared/User/UserName";
import type { Emergency } from "~/models";

type Props = {
  emergencies: Emergency[];
};

export function ResolvedEmergenciesHistory({ emergencies }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {emergencies.map((emergency) => (
        <li
          className="rounded-md border-l-4 border-gray-300 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/40"
          key={emergency.id}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="gray">{urgencyLabel(emergency.urgency)}</Badge>
            <Badge color="gray">{threatLevelLabel(emergency.threatLevel)}</Badge>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {categoryLabel(emergency.category)}
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Declared{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                <FormattedIcaoDate date={emergency.declarationTime} />{" "}
                <FormattedIcaoTime date={emergency.declarationTime} />
              </span>{" "}
              by <UserName user={emergency.reportedBy} />
            </span>
            {emergency.resolvedAt && (
              <span>
                Resolved{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  <FormattedIcaoDate date={emergency.resolvedAt} /> <FormattedIcaoTime date={emergency.resolvedAt} />
                </span>
                {emergency.resolvedBy ? (
                  <>
                    {" by "}
                    <UserName user={emergency.resolvedBy} />
                  </>
                ) : null}
              </span>
            )}
          </div>

          {emergency.freeText && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{emergency.freeText}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
