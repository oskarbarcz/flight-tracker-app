import { FlightEventType, FlightStatus } from "~/models";

export function translateFlightEventType(eventType: FlightEventType): string {
  const eventNames = {
    [FlightEventType.FlightWasCreated]: "Flight plan registered",
    [FlightEventType.PreliminaryLoadsheetWasUpdated]:
      "Preliminary loadsheet updated",
    [FlightEventType.ScheduledTimesheetWasUpdated]:
      "Scheduled timesheet updated",
    [FlightEventType.FlightWasAddedToRotation]: "Added to rotation",
    [FlightEventType.FlightWasRemovedFromRotation]: "Removed from rotation",
    [FlightEventType.FlightWasReleased]: "Flight released",
    [FlightEventType.PilotCheckedIn]: "Pilot checked in",
    [FlightEventType.BoardingWasStarted]: "Boarding started",
    [FlightEventType.BoardingWasFinished]: "Boarding finished",
    [FlightEventType.OffBlockWasReported]: "Off-block reported",
    [FlightEventType.TakeoffWasReported]: "Takeoff reported",
    [FlightEventType.ArrivalWasReported]: "Arrival reported",
    [FlightEventType.OnBlockWasReported]: "On-block reported",
    [FlightEventType.OffboardingWasStarted]: "Offboarding started",
    [FlightEventType.OffboardingWasFinished]: "Offboarding finished",
    [FlightEventType.FlightWasClosed]: "Flight closed",
    [FlightEventType.FlightTrackWasSaved]: "Flight track saved",
  };

  return eventNames[eventType];
}

export default function translateStatus(status: FlightStatus): string {
  const statuses = {
    [FlightStatus.Created]: "Created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Crew checked in",
    [FlightStatus.BoardingStarted]: "Boarding in progress",
    [FlightStatus.BoardingFinished]: "Boarding finished",
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "On block",
    [FlightStatus.OffboardingStarted]: "Offboarding in progress",
    [FlightStatus.OffboardingFinished]: "Offboarding finished",
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}

export function statusToShortHumanForm(status: FlightStatus): string {
  const statuses = {
    [FlightStatus.Created]: "Created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Checked in",
    [FlightStatus.BoardingStarted]: "Boarding",
    [FlightStatus.BoardingFinished]: "Taxiing out",
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "Just arrived",
    [FlightStatus.OffboardingStarted]: "Offboarding",
    [FlightStatus.OffboardingFinished]: "Offboarding",
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}

export function translateNextActionStatus(status: FlightStatus): string | null {
  switch (status) {
    case FlightStatus.Ready:
      return "Check in for flight";
    case FlightStatus.CheckedIn:
      return "Start boarding";
    case FlightStatus.BoardingStarted:
      return "Fill loadsheet and finish boarding";
    case FlightStatus.BoardingFinished:
      return "Report off-block";
    case FlightStatus.TaxiingOut:
      return "Report takeoff";
    case FlightStatus.InCruise:
      return "Report arrival";
    case FlightStatus.TaxiingIn:
      return "Report on-block";
    case FlightStatus.OnBlock:
      return "Start offboarding";
    case FlightStatus.OffboardingStarted:
      return "Finish offboarding";
    case FlightStatus.OffboardingFinished:
      return "Close flight";
    default:
      return null;
  }
}
