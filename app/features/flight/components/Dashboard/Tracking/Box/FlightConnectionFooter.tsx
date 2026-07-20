import { Button } from "flowbite-react";
import React from "react";
import { FaRotateRight } from "react-icons/fa6";
import type { FlightConnectionStatus } from "~/features/flight/events.socket";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";

type StatusStyle = {
  label: string;
  dot: string;
  text: string;
  pulse: boolean;
};

const statusStyles: Record<FlightConnectionStatus, StatusStyle> = {
  connecting: { label: "Connecting…", dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400", pulse: true },
  live: { label: "Live", dot: "bg-green-500", text: "text-gray-500 dark:text-gray-400", pulse: false },
  reconnecting: {
    label: "Reconnecting…",
    dot: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    pulse: true,
  },
  lost: { label: "Connection lost", dot: "bg-red-500", text: "text-red-600 dark:text-red-400", pulse: false },
};

export function FlightConnectionFooter() {
  const { connectionStatus, reconnect } = useTrackedFlight();
  const style = statusStyles[connectionStatus];

  return (
    <BoxFooter
      leading={
        <div className={`flex items-center gap-2 text-xs font-medium ${style.text}`}>
          <span
            className={`inline-block h-2 w-2 rounded-full ${style.dot} ${style.pulse ? "animate-pulse" : ""}`}
            aria-hidden={true}
          />
          {style.label}
        </div>
      }
    >
      {connectionStatus === "lost" && (
        <Button size="xs" color="light" onClick={reconnect}>
          <FaRotateRight className="mr-1.5" size={12} aria-hidden={true} />
          Retry
        </Button>
      )}
    </BoxFooter>
  );
}
