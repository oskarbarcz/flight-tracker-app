import { FaExclamationTriangle } from "react-icons/fa";
import { FlightStatus } from "~/features/flight";

const beforeOffBlockStatuses = [
  FlightStatus.Created,
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
];

type Props = {
  status: FlightStatus;
  isOnline: boolean;
};

const labelClass = "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em]";

export function AdsbStatusIndicator({ status, isOnline }: Props) {
  if (isOnline) {
    return (
      <span className={`${labelClass} text-green-700 dark:text-green-400`}>
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:hidden" />
          <span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
        </span>
        ADS-B online
      </span>
    );
  }

  if (beforeOffBlockStatuses.includes(status)) {
    return (
      <span className={`${labelClass} text-gray-500 dark:text-gray-400`}>
        <span className="size-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
        ADS-B offline
      </span>
    );
  }

  return (
    <span className={`${labelClass} text-amber-700 dark:text-amber-400`}>
      <FaExclamationTriangle className="size-3" />
      ADS-B offline
    </span>
  );
}
