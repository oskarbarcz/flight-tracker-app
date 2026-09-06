import React from "react";
import { type Flight, FlightStatus } from "~/features/flight";
import { ChangeFlightProgressButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { LifecycleTrack } from "~/features/flight/components/Dashboard/Tracking/Progress/LifecycleTrack";
import { PhaseMetrics } from "~/features/flight/components/Dashboard/Tracking/Progress/PhaseMetrics";
import { toHuman } from "~/i18n/translate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";

const NO_ACTION_STATUSES = [FlightStatus.Created, FlightStatus.Closed];

export function FlightProgressSummary({ flight }: { flight: Flight }) {
  const showAction = !NO_ACTION_STATUSES.includes(flight.status);

  return (
    <>
      <hr className="border-gray-200 dark:border-gray-700" />
      <div>
        <FieldLabel>Phase</FieldLabel>
        <p className="mt-0.5 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {toHuman.flight.status.phase(flight.status, flight.serviceType)}
        </p>
      </div>
      <LifecycleTrack status={flight.status} />
      <hr className="border-gray-200 dark:border-gray-700" />
      <PhaseMetrics flight={flight} />
      {showAction && (
        <div className="mt-auto">
          <BoxFooter>
            <ChangeFlightProgressButton />
          </BoxFooter>
        </div>
      )}
    </>
  );
}
