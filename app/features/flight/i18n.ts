import {
  AirportOnFlightType,
  FlightEventType,
  FlightServiceType,
  FlightStatus,
  PassengerStatus,
  SpecialServiceRequest,
} from "~/features/flight";

type HandlingWording = {
  onboarding: string;
  offboarding: string;
};

function handlingWording(serviceType: FlightServiceType): HandlingWording {
  return serviceType === FlightServiceType.Cargo
    ? { onboarding: "Loading", offboarding: "Unloading" }
    : { onboarding: "Boarding", offboarding: "Offboarding" };
}

export function translateAirportOnFlightType(type: AirportOnFlightType): string {
  const labels: Record<AirportOnFlightType, string> = {
    [AirportOnFlightType.Departure]: "Departure",
    [AirportOnFlightType.Destination]: "Destination",
    [AirportOnFlightType.DestinationAlternate]: "Destination alternate",
    [AirportOnFlightType.EnrouteAlternate]: "Enroute alternate",
    [AirportOnFlightType.EtopsEntry]: "ETOPS entry",
    [AirportOnFlightType.EtopsExit]: "ETOPS exit",
  };

  return labels[type];
}

export function translateEventType(
  eventType: FlightEventType,
  serviceType: FlightServiceType = FlightServiceType.Passenger,
): string {
  const { onboarding, offboarding } = handlingWording(serviceType);
  const eventNames: Record<FlightEventType, string> = {
    [FlightEventType.FlightWasCreated]: "Flight plan registered",
    [FlightEventType.PreliminaryLoadsheetWasUpdated]: "Preliminary loadsheet updated",
    [FlightEventType.ScheduledTimesheetWasUpdated]: "Scheduled timesheet updated",
    [FlightEventType.DepartureParkingPositionWasChanged]: "Departure parking position changed",
    [FlightEventType.DepartureRunwayWasChanged]: "Departure runway changed",
    [FlightEventType.ArrivalParkingPositionWasChanged]: "Arrival parking position changed",
    [FlightEventType.ArrivalRunwayWasChanged]: "Arrival runway changed",
    [FlightEventType.FlightWasReleased]: "Flight released",
    [FlightEventType.PilotCheckedIn]: "Pilot checked in",
    [FlightEventType.BoardingWasStarted]: `${onboarding} started`,
    [FlightEventType.BoardingWasFinished]: `${onboarding} finished`,
    [FlightEventType.LivePositionReceived]: "Live position received",
    [FlightEventType.OffBlockWasReported]: "Off-block reported",
    [FlightEventType.TakeoffWasReported]: "Takeoff reported",
    [FlightEventType.ArrivalWasReported]: "Arrival reported",
    [FlightEventType.OnBlockWasReported]: "On-block reported",
    [FlightEventType.OffboardingWasStarted]: `${offboarding} started`,
    [FlightEventType.OffboardingWasFinished]: `${offboarding} finished`,
    [FlightEventType.FlightWasClosed]: "Flight closed",
    [FlightEventType.FlightTrackWasSaved]: "Flight track saved",
    [FlightEventType.EmergencyWasDeclared]: "Emergency declared",
    [FlightEventType.EmergencyWasUpdated]: "Emergency updated",
    [FlightEventType.EmergencyWasResolved]: "Emergency resolved",
    [FlightEventType.DiversionWasReported]: "Diversion reported",
    [FlightEventType.DiversionWasUpdated]: "Diversion updated",
    [FlightEventType.DelayRequestWasCreated]: "Delay request created",
    [FlightEventType.DelayReportWasFiled]: "Delay report filed",
    [FlightEventType.DelayReportWasAccepted]: "Delay report accepted",
    [FlightEventType.DelayReportWasRejected]: "Delay report rejected",
  };

  return eventNames[eventType] ?? eventType;
}

export function translateStatus(
  status: FlightStatus,
  serviceType: FlightServiceType = FlightServiceType.Passenger,
): string {
  const { onboarding, offboarding } = handlingWording(serviceType);
  const statuses = {
    [FlightStatus.Created]: "Created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Crew checked in",
    [FlightStatus.BoardingStarted]: `${onboarding} in progress`,
    [FlightStatus.BoardingFinished]: `${onboarding} finished`,
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "On block",
    [FlightStatus.OffboardingStarted]: `${offboarding} in progress`,
    [FlightStatus.OffboardingFinished]: `${offboarding} finished`,
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}

export function translateShortStatus(
  status: FlightStatus,
  serviceType: FlightServiceType = FlightServiceType.Passenger,
): string {
  const { onboarding, offboarding } = handlingWording(serviceType);
  const statuses = {
    [FlightStatus.Created]: "Created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Checked in",
    [FlightStatus.BoardingStarted]: onboarding,
    [FlightStatus.BoardingFinished]: "Taxiing out",
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "Just arrived",
    [FlightStatus.OffboardingStarted]: offboarding,
    [FlightStatus.OffboardingFinished]: offboarding,
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}

export function translateStatusNextAction(
  status: FlightStatus,
  serviceType: FlightServiceType = FlightServiceType.Passenger,
): string | null {
  const { onboarding, offboarding } = handlingWording(serviceType);

  switch (status) {
    case FlightStatus.Ready:
      return "Check in for flight";
    case FlightStatus.CheckedIn:
      return `Start ${onboarding.toLowerCase()}`;
    case FlightStatus.BoardingStarted:
      return `Fill loadsheet and finish ${onboarding.toLowerCase()}`;
    case FlightStatus.BoardingFinished:
      return "Report off-block";
    case FlightStatus.TaxiingOut:
      return "Report takeoff";
    case FlightStatus.InCruise:
      return "Report arrival";
    case FlightStatus.TaxiingIn:
      return "Report on-block";
    case FlightStatus.OnBlock:
      return `Start ${offboarding.toLowerCase()}`;
    case FlightStatus.OffboardingStarted:
      return `Finish ${offboarding.toLowerCase()}`;
    case FlightStatus.OffboardingFinished:
      return "Close flight";
    default:
      return null;
  }
}

export function translatePassengerStatus(status: PassengerStatus): string {
  const labels: Record<PassengerStatus, string> = {
    [PassengerStatus.Boarded]: "Boarded",
    [PassengerStatus.NoShow]: "No-show",
  };

  return labels[status];
}

export function translateSpecialServiceRequest(request: SpecialServiceRequest): string {
  const labels: Record<SpecialServiceRequest, string> = {
    [SpecialServiceRequest.Infant]: "Infant in arms",
    [SpecialServiceRequest.WheelchairToRamp]: "Wheelchair to ramp",
    [SpecialServiceRequest.WheelchairToSteps]: "Wheelchair to steps",
    [SpecialServiceRequest.WheelchairToSeat]: "Wheelchair to seat",
    [SpecialServiceRequest.UnaccompaniedMinor]: "Unaccompanied minor",
    [SpecialServiceRequest.Blind]: "Blind or low vision",
    [SpecialServiceRequest.Deaf]: "Deaf or hard of hearing",
    [SpecialServiceRequest.MeetAndAssist]: "Meet and assist",
    [SpecialServiceRequest.PetInCabin]: "Pet in cabin",
  };

  return labels[request];
}
