import { FaTowerBroadcast, FaTriangleExclamation } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import {
  hasDestinationShape,
  hasLivePosition,
} from "~/features/flight/components/Dashboard/Tracking/Progress/autoTakeoff";
import { NoticeCondition } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticeCondition";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function AutoArrivalNotice() {
  const { flight, events } = useTrackedFlight();

  if (!flight || flight.status !== FlightStatus.InCruise) {
    return null;
  }

  const mapped = hasDestinationShape(flight);
  const live = hasLivePosition(events);

  if (mapped && live) {
    return (
      <NoticePanel
        tone="info"
        icon={FaTowerBroadcast}
        title="Automatic arrival detection is active"
        description="Arrival will be reported automatically once the aircraft has landed and slowed inside the destination airport. You can still report arrival manually."
      >
        <NoticeCondition ok={true} text="Destination airport mapped" />
        <NoticeCondition ok={true} text="ADS-B signal acquired" />
      </NoticePanel>
    );
  }

  return (
    <NoticePanel
      tone="warning"
      icon={FaTriangleExclamation}
      title="Manual arrival report required"
      description="Automatic detection is unavailable, report arrival manually."
    >
      <NoticeCondition ok={mapped} text={mapped ? "Destination airport mapped" : "Destination airport not mapped"} />
      <NoticeCondition ok={live} text={live ? "ADS-B signal acquired" : "Awaiting ADS-B signal"} />
    </NoticePanel>
  );
}
