import { FaTowerBroadcast, FaTriangleExclamation } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import {
  hasDepartureShape,
  hasLivePosition,
} from "~/features/flight/components/Dashboard/Tracking/Progress/autoTakeoff";
import { NoticeCondition } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticeCondition";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function AutoTakeoffNotice() {
  const { flight, events } = useTrackedFlight();

  if (!flight || flight.status !== FlightStatus.TaxiingOut) {
    return null;
  }

  const mapped = hasDepartureShape(flight);
  const live = hasLivePosition(events);

  if (mapped && live) {
    return (
      <NoticePanel
        tone="info"
        icon={FaTowerBroadcast}
        title="Automatic takeoff detection is active"
        description="Takeoff will be reported automatically once airborne, no action required. You can still report takeoff manually."
      >
        <NoticeCondition ok={true} text="Departure airport mapped" />
        <NoticeCondition ok={true} text="ADS-B signal acquired" />
      </NoticePanel>
    );
  }

  return (
    <NoticePanel
      tone="warning"
      icon={FaTriangleExclamation}
      title="Manual takeoff report required"
      description="Automatic detection is unavailable, report takeoff once airborne."
    >
      <NoticeCondition ok={mapped} text={mapped ? "Departure airport mapped" : "Departure airport not mapped"} />
      <NoticeCondition ok={live} text={live ? "ADS-B signal acquired" : "Awaiting ADS-B signal"} />
    </NoticePanel>
  );
}
