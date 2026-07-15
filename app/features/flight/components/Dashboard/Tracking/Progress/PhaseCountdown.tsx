import { twMerge } from "tailwind-merge";
import { useCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/useCountdown";
import { formatTimeInterval } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  targetTime: Date;
};

export function PhaseCountdown({ label, targetTime }: Props) {
  const secondsLeft = useCountdown(targetTime);
  const overdue = secondsLeft < 0;

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <span
        className={twMerge(
          "mt-1 block font-mono text-3xl font-bold tabular-nums",
          overdue ? "text-amber-700 dark:text-amber-400" : "text-gray-900 dark:text-gray-100",
        )}
      >
        {formatTimeInterval(secondsLeft)}
      </span>
    </div>
  );
}
