import React from "react";
import { FaArrowRight, FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";
import { Link, useLocation } from "react-router";
import { FlightStatus } from "~/features/flight";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { FlightDataTab, flightDataTabSlug } from "~/features/flight/lib/flightDataTabs";

const WARNING_STATUSES = [
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
];

export function DelayNotice() {
  const { flight, delayRequest } = useTrackedFlight();
  const { pathname } = useLocation();

  if (!flight || delayRequest === null || delayRequest.isSettled) {
    return null;
  }

  const isCruise = flight.status === FlightStatus.InCruise;
  const isWarning = WARNING_STATUSES.includes(flight.status);

  if (!isCruise && !isWarning) {
    return null;
  }

  const slug = flightDataTabSlug(FlightDataTab.Delays);
  const minutes = delayRequest.totalDelayMinutes;
  const closing = isWarning
    ? "Settle it before the flight can be closed."
    : "It must be settled before the flight can be closed.";

  return (
    <div className="mb-4">
      <NoticePanel
        tone={isWarning ? "warning" : "neutral"}
        icon={isWarning ? FaTriangleExclamation : FaCircleInfo}
        title="Unsettled delay"
        description={`This flight has ${minutes} min of delay awaiting settlement. ${closing}`}
        action={
          pathname.endsWith(`/${slug}`) ? undefined : (
            <Link
              to={`/track/${flight.id}/${slug}`}
              viewTransition
              className="group inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
            >
              Open delay report
              <FaArrowRight
                className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden={true}
              />
            </Link>
          )
        }
      />
    </div>
  );
}
