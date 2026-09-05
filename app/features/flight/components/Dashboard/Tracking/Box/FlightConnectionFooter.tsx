import { Button } from "flowbite-react";
import React from "react";
import { FaRotateRight } from "react-icons/fa6";
import { FlightQuickStatus } from "~/features/flight/components/Dashboard/Tracking/Box/FlightQuickStatus";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";

export function FlightConnectionFooter() {
  const { connectionStatus, reconnect } = useTrackedFlight();

  return (
    <BoxFooter leading={<FlightQuickStatus />}>
      {connectionStatus === "lost" && (
        <Button size="xs" color="light" onClick={reconnect}>
          <FaRotateRight className="mr-1.5" size={12} aria-hidden={true} />
          Retry
        </Button>
      )}
    </BoxFooter>
  );
}
