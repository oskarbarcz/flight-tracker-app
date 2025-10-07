import { FlightEventType } from "~/models";

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
