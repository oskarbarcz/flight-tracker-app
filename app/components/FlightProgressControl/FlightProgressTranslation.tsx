import { FlightStatus } from "~/models";

type FlightProgressTranslationProps = {
  status: FlightStatus;
};

export default function FlightProgressTranslation({
  status,
}: FlightProgressTranslationProps) {
  const statuses = {
    [FlightStatus.Created]: "Just created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Pilot checked in",
    [FlightStatus.BoardingStarted]: "Boarding in progress",
    [FlightStatus.BoardingFinished]: "Boarding finished",
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "On block",
    [FlightStatus.OffboardingStarted]: "Offboarding in progress",
    [FlightStatus.OffboardingFinished]: "Offboarding was finished",
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}
