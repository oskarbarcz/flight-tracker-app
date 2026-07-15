import { FaTowerBroadcast, FaTriangleExclamation } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import { hasLivePosition } from "~/features/flight/components/Dashboard/Tracking/Progress/autoTakeoff";
import { NoticeCondition } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticeCondition";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function AutoOffBlockNotice() {
  const { flight, events } = useTrackedFlight();

  if (!flight || flight.status !== FlightStatus.BoardingFinished) {
    return null;
  }

  if (hasLivePosition(events)) {
    return (
      <NoticePanel
        tone="info"
        icon={FaTowerBroadcast}
        title="Automatic off-block detection is active"
        description="Off-block will be reported automatically once the aircraft starts moving. You can still report off-block manually."
      >
        <NoticeCondition ok={true} text="ADS-B signal acquired" />
      </NoticePanel>
    );
  }

  return (
    <NoticePanel
      tone="warning"
      icon={FaTriangleExclamation}
      title="Manual off-block report required"
      description="Automatic detection is unavailable, report off-block manually."
    >
      <NoticeCondition ok={false} text="Awaiting ADS-B signal" />
    </NoticePanel>
  );
}
