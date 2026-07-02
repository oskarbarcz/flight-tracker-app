import React from "react";
import { FaGaugeHigh } from "react-icons/fa6";
import { FlightTimerBox } from "~/features/flight/components/Dashboard/Tracking/Box/FlightTimerBox";
import { ChangeFlightProgressButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";
import { FlightStatus } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

function showNextAction(status: FlightStatus): boolean {
  return [
    FlightStatus.Ready,
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
    FlightStatus.TaxiingOut,
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
    FlightStatus.OnBlock,
    FlightStatus.OffboardingStarted,
    FlightStatus.OffboardingFinished,
  ].includes(status);
}

export function FlightProgressBox() {
  const { flight } = useTrackedFlight();

  if (!flight) return null;

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaGaugeHigh} title="Flight progress" />
      <div className="flex items-center flex-wrap text-lg">
        <div className="w-full mb-2">
          <span className="text-gray-500 text-sm">Flight status</span>
          <p className="font-bold text-indigo-500">{toHuman.flight.status.standard(flight.status)}</p>
        </div>
      </div>
      <hr className="mt-1 mb-3 border-gray-300 dark:border-gray-700" />
      <FlightTimerBox />
      <div className="mt-auto">
        <hr className="w-full mt-1 mb-3 border-gray-300 dark:border-gray-700" />
        {showNextAction(flight.status) && <ChangeFlightProgressButton />}
      </div>
    </Container>
  );
}
