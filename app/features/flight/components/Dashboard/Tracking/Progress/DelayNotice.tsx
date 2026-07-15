import { FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

const WARNING_STATUSES = [
  FlightStatus.TaxiingIn,
  FlightStatus.OnBlock,
  FlightStatus.OffboardingStarted,
  FlightStatus.OffboardingFinished,
];

export function DelayNotice() {
  const { flight, delayRequest } = useTrackedFlight();

  if (!flight || delayRequest === null || delayRequest.isSettled) {
    return null;
  }

  const isCruise = flight.status === FlightStatus.InCruise;
  const isWarning = WARNING_STATUSES.includes(flight.status);

  if (!isCruise && !isWarning) {
    return null;
  }

  const minutes = delayRequest.totalDelayMinutes;

  if (isWarning) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
          <FaTriangleExclamation size={15} aria-hidden={true} />
          Unsettled delay
        </div>
        <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">
          This flight has {minutes} min of delay awaiting settlement. Settle it before the flight can be closed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-500/30 dark:bg-gray-500/10">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
        <FaCircleInfo size={15} aria-hidden={true} />
        Unsettled delay
      </div>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
        This flight has {minutes} min of delay awaiting settlement. It must be settled before the flight can be closed.
      </p>
    </div>
  );
}
