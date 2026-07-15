import { FaCircleInfo, FaTriangleExclamation } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
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
      <NoticePanel
        tone="warning"
        icon={FaTriangleExclamation}
        title="Unsettled delay"
        description={`This flight has ${minutes} min of delay awaiting settlement. Settle it before the flight can be closed.`}
      />
    );
  }

  return (
    <NoticePanel
      tone="neutral"
      icon={FaCircleInfo}
      title="Unsettled delay"
      description={`This flight has ${minutes} min of delay awaiting settlement. It must be settled before the flight can be closed.`}
    />
  );
}
