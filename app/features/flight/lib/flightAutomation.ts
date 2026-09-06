import { type Flight, type FlightEvent, FlightEventType, FlightStatus } from "~/features/flight/model";

export type AutomationCondition = {
  ok: boolean;
  text: string;
};

export type AutomationState = {
  isAutomatic: boolean;
  subject: string;
  title: string;
  description: string;
  conditions: AutomationCondition[];
};

type ReportSpec = {
  subject: string;
  whenAutomatic: string;
  whenManual: string;
  mapping: AutomationCondition | null;
};

const MINIMUM_SHAPE_POINTS = 3;

function describe(ok: boolean, met: string, missing: string): AutomationCondition {
  return { ok, text: ok ? met : missing };
}

function hasDepartureShape(flight: Flight): boolean {
  return (flight.departureAirport?.shape?.length ?? 0) >= MINIMUM_SHAPE_POINTS;
}

function hasDestinationShape(flight: Flight): boolean {
  return (flight.destinationAirport?.shape?.length ?? 0) >= MINIMUM_SHAPE_POINTS;
}

export function hasLivePosition(events: FlightEvent[]): boolean {
  return events.some((event) => event.type === FlightEventType.LivePositionReceived);
}

function reportSpec(flight: Flight): ReportSpec | null {
  const specs: Partial<Record<FlightStatus, ReportSpec>> = {
    [FlightStatus.BoardingFinished]: {
      subject: "off-block",
      whenAutomatic:
        "Off-block will be reported automatically once the aircraft starts moving. You can still report off-block manually.",
      whenManual: "Automatic detection is unavailable, report off-block manually.",
      mapping: null,
    },
    [FlightStatus.TaxiingOut]: {
      subject: "takeoff",
      whenAutomatic:
        "Takeoff will be reported automatically once airborne, no action required. You can still report takeoff manually.",
      whenManual: "Automatic detection is unavailable, report takeoff once airborne.",
      mapping: describe(hasDepartureShape(flight), "Departure airport mapped", "Departure airport not mapped"),
    },
    [FlightStatus.InCruise]: {
      subject: "arrival",
      whenAutomatic:
        "Arrival will be reported automatically once the aircraft has landed and slowed inside the destination airport. You can still report arrival manually.",
      whenManual: "Automatic detection is unavailable, report arrival manually.",
      mapping: describe(hasDestinationShape(flight), "Destination airport mapped", "Destination airport not mapped"),
    },
  };

  return specs[flight.status] ?? null;
}

export function flightAutomation(flight: Flight, events: FlightEvent[]): AutomationState | null {
  const spec = reportSpec(flight);

  if (spec === null) {
    return null;
  }

  const signal = describe(hasLivePosition(events), "ADS-B signal acquired", "Awaiting ADS-B signal");
  const conditions = spec.mapping === null ? [signal] : [spec.mapping, signal];
  const isAutomatic = conditions.every((condition) => condition.ok);

  return {
    isAutomatic,
    subject: spec.subject,
    title: isAutomatic ? `Automatic ${spec.subject} detection is active` : `Manual ${spec.subject} report required`,
    description: isAutomatic ? spec.whenAutomatic : spec.whenManual,
    conditions,
  };
}

export function manualReportLabel(state: AutomationState): string {
  return `Manually report ${state.subject}`;
}
