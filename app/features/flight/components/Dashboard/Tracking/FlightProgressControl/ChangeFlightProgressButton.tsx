import { Button, Tooltip } from "flowbite-react";
import React, { type ReactElement, useEffect } from "react";
import { FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import { AutomationSummary } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/AutomationSummary";
import { CheckInButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/CheckInButton";
import { CloseFlightButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/CloseFlightButton";
import { FinishBoardingButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/FinishBoardingButton";
import { FinishOffboardingButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/FinishOffboardingButton";
import { ReportArrivalButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/ReportArrivalButton";
import { ReportOffBlockButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/ReportOffBlockButton";
import { ReportOnBlockButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/ReportOnBlockButton";
import { ReportTakeoffButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/ReportTakeoffButton";
import { StartBoardingButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/StartBoardingButton";
import { StartOffboardingButton } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/Button/StartOffboardingButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { flightAutomation, manualReportLabel } from "~/features/flight/lib/flightAutomation";

export type FlightProgressTone = "indigo" | "warning";

export type FlightProgressButtonProps = {
  disabled: boolean;
  tone: FlightProgressTone;
  label?: string;
};

function mapStatusToButton(
  status: FlightStatus,
  props: FlightProgressButtonProps,
): ReactElement<typeof StartBoardingButton> | null {
  switch (status) {
    case FlightStatus.Ready:
      return <CheckInButton {...props} />;
    case FlightStatus.CheckedIn:
      return <StartBoardingButton {...props} />;
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton {...props} />;
    case FlightStatus.BoardingFinished:
      return <ReportOffBlockButton {...props} />;
    case FlightStatus.TaxiingOut:
      return <ReportTakeoffButton {...props} />;
    case FlightStatus.InCruise:
      return <ReportArrivalButton {...props} />;
    case FlightStatus.TaxiingIn:
      return <ReportOnBlockButton {...props} />;
    case FlightStatus.OnBlock:
      return <StartOffboardingButton {...props} />;
    case FlightStatus.OffboardingStarted:
      return <FinishOffboardingButton {...props} />;
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton {...props} />;
    default:
      return null;
  }
}

export function ChangeFlightProgressButton() {
  const [disabled, setDisabled] = React.useState(true);
  const { flight, events } = useTrackedFlight();

  useEffect(() => {
    setDisabled(true);
  }, []);

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

  const automation = flightAutomation(flight, events);
  const tone: FlightProgressTone = automation !== null && !automation.isAutomatic ? "warning" : "indigo";
  const label = automation?.isAutomatic === true ? manualReportLabel(automation) : undefined;
  const action = mapStatusToButton(flight.status, { disabled, tone, label });

  return (
    <>
      <Button color={tone} outline onClick={onClick}>
        {disabled && <FaUnlock />}
        {!disabled && <FaLock />}
      </Button>
      {automation === null ? action : <Tooltip content={<AutomationSummary state={automation} />}>{action}</Tooltip>}
    </>
  );
}
