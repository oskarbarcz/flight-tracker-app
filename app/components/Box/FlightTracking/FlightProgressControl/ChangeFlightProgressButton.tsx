"use client";

import StartBoardingButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/StartBoardingButton";
import { FlightStatus } from "~/models";
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
import { Button } from "flowbite-react";
import { FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import CheckInButton from "~/components/Box/FlightTracking/FlightProgressControl/Button/CheckInButton";

function mapStatusToButton(
  status: FlightStatus,
  disabled: boolean,
): ReactElement<typeof StartBoardingButton> | null {
  switch (status) {
    case FlightStatus.Ready:
      return <CheckInButton disabled={disabled} />;
    case FlightStatus.CheckedIn:
      return <StartBoardingButton disabled={disabled} />;
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton disabled={disabled} />;
    case FlightStatus.BoardingFinished:
      return <ReportOffBlockButton disabled={disabled} />;
    case FlightStatus.TaxiingOut:
      return <ReportTakeoffButton disabled={disabled} />;
    case FlightStatus.InCruise:
      return <ReportArrivalButton disabled={disabled} />;
    case FlightStatus.TaxiingIn:
      return <ReportOnBlockButton disabled={disabled} />;
    case FlightStatus.OnBlock:
      return <StartOffboardingButton disabled={disabled} />;
    case FlightStatus.OffboardingStarted:
      return <FinishOffboardingButton disabled={disabled} />;
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton disabled={disabled} />;
    default:
      return null;
  }
}

export type FlightProgressButtonProps = {
  disabled: boolean;
};

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

  return (
    <div className="mt-4 flex w-full justify-end gap-3">
      <Button color="indigo" onClick={onClick}>
        {disabled && <FaUnlock />}
        {!disabled && <FaLock />}
      </Button>
      {mapStatusToButton(flight.status, disabled)}
    </div>
  );
}
