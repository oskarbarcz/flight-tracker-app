import { twMerge } from "tailwind-merge";
import { FlightStatus } from "~/features/flight";

const STAGE_LABELS = ["Prep", "Taxi out", "Cruise", "Taxi in", "Turn"];

function stageIndexForStatus(status: FlightStatus): number {
  switch (status) {
    case FlightStatus.TaxiingOut:
      return 1;
    case FlightStatus.InCruise:
      return 2;
    case FlightStatus.TaxiingIn:
      return 3;
    case FlightStatus.OnBlock:
    case FlightStatus.OffboardingStarted:
    case FlightStatus.OffboardingFinished:
    case FlightStatus.Closed:
      return 4;
    default:
      return 0;
  }
}

type Props = {
  status: FlightStatus;
};

export function LifecycleTrack({ status }: Props) {
  const current = stageIndexForStatus(status);

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {STAGE_LABELS.map((label, index) => (
          <span
            key={label}
            className={twMerge(
              "h-1.5 rounded-full",
              index < current && "bg-gray-400 dark:bg-gray-500",
              index === current && "bg-indigo-500",
              index > current && "bg-gray-200 dark:bg-gray-700",
            )}
          />
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-5 gap-1.5">
        {STAGE_LABELS.map((label, index) => (
          <span
            key={label}
            aria-current={index === current ? "step" : undefined}
            className={twMerge(
              "text-center text-[10px] font-semibold uppercase tracking-wide",
              index === current ? "text-indigo-500" : "text-gray-400 dark:text-gray-500",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
