import { Button } from "flowbite-react";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type Props = {
  label: string;
  canGoEarlier: boolean;
  canGoLater: boolean;
  isAtPresent: boolean;
  onEarlier: () => void;
  onLater: () => void;
  onReturnToPresent: () => void;
};

export function SpanStepper({
  label,
  canGoEarlier,
  canGoLater,
  isAtPresent,
  onEarlier,
  onLater,
  onReturnToPresent,
}: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Button
        size="xs"
        color="light"
        className="px-2"
        disabled={!canGoEarlier}
        onClick={onEarlier}
        title="Earlier period"
        aria-label="Earlier period"
      >
        <FaChevronLeft size={10} aria-hidden={true} />
      </Button>

      <span className="min-w-[12ch] text-center font-mono text-sm font-bold uppercase tabular-nums tracking-wide text-gray-900 dark:text-white">
        {label}
      </span>

      <Button
        size="xs"
        color="light"
        className="px-2"
        disabled={!canGoLater}
        onClick={onLater}
        title="Later period"
        aria-label="Later period"
      >
        <FaChevronRight size={10} aria-hidden={true} />
      </Button>

      {!isAtPresent && (
        <Button size="xs" color="subtle" onClick={onReturnToPresent}>
          Now
        </Button>
      )}
    </div>
  );
}
