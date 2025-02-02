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

type FlightProgressButtonProps = {
  flightId: string;
  status: FlightStatus;
};

function mapStatusToButton(
  flightId: string,
  status: FlightStatus,
): ReactElement | null {
  switch (status) {
    case FlightStatus.CheckedIn:
      return <StartBoardingButton flightId={flightId} />;
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton flightId={flightId} />;
    case FlightStatus.BoardingFinished:
      return <ReportOffBlockButton flightId={flightId} />;
    case FlightStatus.TaxiingOut:
      return <ReportTakeoffButton flightId={flightId} />;
    case FlightStatus.InCruise:
      return <ReportArrivalButton flightId={flightId} />;
    case FlightStatus.TaxiingIn:
      return <ReportOnBlockButton flightId={flightId} />;
    case FlightStatus.OnBlock:
      return <StartOffboardingButton flightId={flightId} />;
    case FlightStatus.OffboardingStarted:
      return <FinishOffboardingButton flightId={flightId} />;
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton flightId={flightId} />;
    case FlightStatus.Created:
    case FlightStatus.Ready:
    case FlightStatus.Closed:
    default:
      return null;
  }
}

export default function FlightProgressControl({
  flightId,
  status,
}: FlightProgressButtonProps) {
  const actionButton = mapStatusToButton(flightId, status);

  return (
    <span className="mx-auto block text-center">
      <span className="font-bold">
        {"Current status: "}
        <FlightProgressTranslation status={status} />
      </span>
      <span className="block text-center">{actionButton}</span>
    </span>
  );
}
