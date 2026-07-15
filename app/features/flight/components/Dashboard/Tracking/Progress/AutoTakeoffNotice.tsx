import { FaCheck, FaTowerBroadcast, FaTriangleExclamation } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { FlightStatus } from "~/features/flight";
import {
  hasDepartureShape,
  hasLivePosition,
} from "~/features/flight/components/Dashboard/Tracking/Progress/autoTakeoff";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

function Condition({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? FaCheck : FaTriangleExclamation;
  return (
    <span
      className={twMerge(
        "flex items-center gap-2 text-xs font-semibold",
        ok ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400",
      )}
    >
      <Icon size={12} aria-hidden={true} />
      {text}
    </span>
  );
}

export function AutoTakeoffNotice() {
  const { flight, events } = useTrackedFlight();

  if (!flight || flight.status !== FlightStatus.TaxiingOut) {
    return null;
  }

  const mapped = hasDepartureShape(flight);
  const live = hasLivePosition(events);
  const available = mapped && live;

  if (available) {
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-500/30 dark:bg-sky-500/10">
        <div className="flex items-center gap-2 text-sm font-bold text-sky-800 dark:text-sky-300">
          <FaTowerBroadcast size={15} aria-hidden={true} />
          Automatic takeoff detection is active
        </div>
        <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">
          Takeoff will be reported automatically once airborne, no action required. You can still report takeoff
          manually.
        </p>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <Condition ok={true} text="Departure airport mapped" />
          <Condition ok={true} text="Live position acquired" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
        <FaTriangleExclamation size={15} aria-hidden={true} />
        Manual takeoff report required
      </div>
      <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">
        Automatic detection is unavailable, report takeoff once airborne.
      </p>
      <div className="mt-2.5 flex flex-col gap-1.5">
        <Condition ok={mapped} text={mapped ? "Departure airport mapped" : "Departure airport not mapped"} />
        <Condition ok={live} text={live ? "Live position acquired" : "Awaiting live position (ADS-B)"} />
      </div>
    </div>
  );
}
