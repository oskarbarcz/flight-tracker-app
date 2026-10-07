import { Button } from "flowbite-react";
import React, { type ReactElement, useEffect, useRef } from "react";
import { LuLock, LuLockOpen } from "react-icons/lu";
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

function focusLockButtonWhenActionFocused(controls: HTMLElement | null, lockButton: HTMLElement | null): void {
  const focused = document.activeElement;

  if (focused !== lockButton && controls?.contains(focused)) {
    lockButton?.focus();
  }
}

export function ChangeFlightProgressButton() {
  const [disabled, setDisabled] = React.useState(true);
  const { flight, events } = useTrackedFlight();
  const controlsRef = useRef<HTMLDivElement>(null);
  const lockButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDisabled(true);
  }, []);

  useEffect(() => {
    if (!disabled) {
      const timeout = setTimeout(() => {
        focusLockButtonWhenActionFocused(controlsRef.current, lockButtonRef.current);
        setDisabled(true);
      }, 5000);
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
    <div className="flex flex-col gap-2">
      <div ref={controlsRef} className="flex items-center justify-end gap-2">
        <Button
          ref={lockButtonRef}
          color={tone}
          outline
          onClick={onClick}
          aria-label="Unlock status change"
          aria-pressed={!disabled}
        >
          {disabled ? <LuLockOpen aria-hidden={true} /> : <LuLock aria-hidden={true} />}
        </Button>
        {action}
      </div>
      {automation !== null && <AutomationSummary state={automation} />}
    </div>
  );
}
