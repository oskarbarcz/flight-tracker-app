"use client";

import StartBoardingButton from "~/components/FlightProgressControl/Button/StartBoardingButton";
import { Flight, FlightStatus } from "~/models";
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
  flight: Flight;
};

function mapStatusToButton(flight: Flight): ReactElement<typeof StartBoardingButton> | null {
  switch (flight.status) {
    case FlightStatus.CheckedIn:
      return <StartBoardingButton flight={flight} />;
    case FlightStatus.BoardingStarted:
      return <FinishBoardingButton flight={flight} />;
    case FlightStatus.BoardingFinished:
      return <ReportOffBlockButton flight={flight} />;
    case FlightStatus.TaxiingOut:
      return <ReportTakeoffButton flight={flight} />;
    case FlightStatus.InCruise:
      return <ReportArrivalButton flight={flight} />;
    case FlightStatus.TaxiingIn:
      return <ReportOnBlockButton flight={flight} />;
    case FlightStatus.OnBlock:
      return <StartOffboardingButton flight={flight} />;
    case FlightStatus.OffboardingStarted:
      return <FinishOffboardingButton flight={flight} />;
    case FlightStatus.OffboardingFinished:
      return <CloseFlightButton flight={flight} />;
    case FlightStatus.Created:
    case FlightStatus.Ready:
    case FlightStatus.Closed:
    default:
      return null;
  }
}

export default function FlightProgressControl({
  flight,
}: FlightProgressButtonProps) {
  const actionButton = mapStatusToButton(flight);

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
