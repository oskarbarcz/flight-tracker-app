"use client";

import StartBoardingButton from "~/components/FlightProgressControl/Button/StartBoardingButton";
import { FlightStatus } from "~/models";
import { ReactElement } from "react";
import FlightProgressTranslation from "~/components/FlightProgressControl/FlightProgressTranslation";
import FinishBoardingButton from "~/components/FlightProgressControl/Button/FinishBoardingButton";
import ReportOffBlockButton from "~/components/FlightProgressControl/Button/ReportOffBlockButton";
import ReportTakeoffButton from "~/components/FlightProgressControl/Button/ReportTakeoffButton";
import ReportArrivalButton from "~/components/FlightProgressControl/Button/ReportArrivalButton";
import ReportOnBlockButton from "~/components/FlightProgressControl/Button/ReportOnBlockButton";
import StartOffboardingButton from "~/components/FlightProgressControl/Button/StartOffboardingButton";
import FinishOffboardingButton from "~/components/FlightProgressControl/Button/FinishOffboardingButton";
import CloseFlightButton from "~/components/FlightProgressControl/Button/CloseFlightButton";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

function mapStatusToButton(
  status: FlightStatus,
): ReactElement<typeof StartBoardingButton> | null {
  switch (status) {
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
    case FlightStatus.Created:
    case FlightStatus.Ready:
    case FlightStatus.Closed:
    default:
      return null;
  }
}

export default function FlightProgressControl() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return;
  }
  const actionButton = mapStatusToButton(flight.status);

  return (
    <span className="mx-auto block text-center">
      <span className="font-bold">
        {"Current status: "}
        <FlightProgressTranslation status={flight.status} />
      </span>
      {actionButton && (
        <span className="block text-center">{actionButton}</span>
      )}
    </span>
  );
}
