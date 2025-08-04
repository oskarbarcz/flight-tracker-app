"use client";

import StartBoardingButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/StartBoardingButton";
import { FlightStatus, describeNextActionStatus } from "~/models";
import React, { ReactElement, useEffect } from "react";
import FinishBoardingButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/FinishBoardingButton";
import ReportOffBlockButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/ReportOffBlockButton";
import ReportTakeoffButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/ReportTakeoffButton";
import ReportArrivalButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/ReportArrivalButton";
import ReportOnBlockButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/ReportOnBlockButton";
import StartOffboardingButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/StartOffboardingButton";
import FinishOffboardingButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/FinishOffboardingButton";
import CloseFlightButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/CloseFlightButton";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { Button, Tooltip } from "flowbite-react";
import { FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import CheckInButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/CheckInButton";

function mapStatusToButton(
  status: FlightStatus,
): ReactElement<typeof StartBoardingButton> | null {
  switch (status) {
    case FlightStatus.Ready:
      return <CheckInButton />;
    case FlightStatus.CheckedIn:
      return <StartBoardingButton />;
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton />;
    case FlightStatus.BoardingFinished:
      return <ReportOffBlockButton />;
    case FlightStatus.TaxiingOut:
      return <ReportTakeoffButton />;
    case FlightStatus.InCruise:
      return <ReportArrivalButton />;
    case FlightStatus.TaxiingIn:
      return <ReportOnBlockButton />;
    case FlightStatus.OnBlock:
      return <StartOffboardingButton />;
    case FlightStatus.OffboardingStarted:
      return <FinishOffboardingButton />;
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton />;
    default:
      return null;
  }
}

export default function ChangeFlightProgressButton() {
  const [disabled, setDisabled] = React.useState(true);
  const { flight } = useTrackedFlight();

  useEffect(() => {
    setDisabled(true);
  }, [flight]);

  useEffect(() => {
    if (!disabled) {
      const timeout = setTimeout(() => setDisabled(true), 5000);
      return () => clearTimeout(timeout);
    }
  }, [disabled]);

  function onClick(): void {
    if (disabled) {
      setDisabled(false);
      return;
    }

    setDisabled(true);
  }

  if (!flight) {
    return;
  }

  let button = mapStatusToButton(flight.status);

  if (disabled) {
    button = (
      <Tooltip content="This button is disabled to prevent accidental click, unlock button on the left.">
        <Button size="xs" disabled>
          {describeNextActionStatus(flight.status)}
        </Button>
      </Tooltip>
    );
  }
  return (
    <div className="mt-4 flex justify-center">
      <Button className="mr-2" onClick={onClick} size="xs">
        {disabled && <FaUnlock />}
        {!disabled && <FaLock />}
      </Button>
      {button}
    </div>
  );
}
