import { FlightStatus } from "~/features/flight";
import type {
  ApiRotationResponse,
  LegAirportResponse,
  LegFlightResponse,
  RotationLegResponse,
  RotationUserResponse,
} from "~/features/rotation/request";

export enum RotationStatus {
  Draft = "draft",
  Ready = "ready",
  InProgress = "in_progress",
  Finished = "finished",
  Canceled = "canceled",
}

export type LegLifecycle = "done" | "active" | "upcoming";

export type RouteStop = {
  key: string;
  iataCode: string;
};

export class RotationLeg {
  id: string;
  flightNumber: string;
  departure: LegAirportResponse;
  arrival: LegAirportResponse;
  offBlockTime: Date;
  onBlockTime: Date;
  blockTime: number;
  flight: LegFlightResponse | null;

  constructor(leg: RotationLegResponse) {
    this.id = leg.id;
    this.flightNumber = leg.flightNumber;
    this.departure = leg.departure;
    this.arrival = leg.arrival;
    this.offBlockTime = new Date(leg.offBlockTime);
    this.onBlockTime = new Date(leg.onBlockTime);
    this.blockTime = leg.blockTime;
    this.flight = leg.flight;
  }

  get isFlown(): boolean {
    return this.flight?.status === FlightStatus.Closed;
  }
}

export class Rotation {
  id: string;
  name: string;
  operatorId: string;
  pilotId: string;
  status: RotationStatus;
  createdBy: RotationUserResponse;
  updatedBy: RotationUserResponse | null;
  canceledBy: RotationUserResponse | null;
  cancellationReason: string | null;
  legs: RotationLeg[];
  createdAt: Date;
  updatedAt: Date | null;
  canceledAt: Date | null;

  constructor(rotation: ApiRotationResponse) {
    this.id = rotation.id;
    this.name = rotation.name;
    this.operatorId = rotation.operatorId;
    this.pilotId = rotation.pilotId;
    this.status = rotation.status;
    this.createdBy = rotation.createdBy;
    this.updatedBy = rotation.updatedBy;
    this.canceledBy = rotation.canceledBy;
    this.cancellationReason = rotation.cancellationReason;
    this.legs = rotation.legs.map((leg) => new RotationLeg(leg));
    this.createdAt = new Date(rotation.createdAt);
    this.updatedAt = rotation.updatedAt ? new Date(rotation.updatedAt) : null;
    this.canceledAt = rotation.canceledAt ? new Date(rotation.canceledAt) : null;
  }

  get isDraft(): boolean {
    return this.status === RotationStatus.Draft;
  }

  get isActive(): boolean {
    return this.status === RotationStatus.Ready || this.status === RotationStatus.InProgress;
  }

  get isFinished(): boolean {
    return this.status === RotationStatus.Finished;
  }

  get isCanceled(): boolean {
    return this.status === RotationStatus.Canceled;
  }

  get orderedLegs(): RotationLeg[] {
    return [...this.legs].sort((a, b) => a.offBlockTime.getTime() - b.offBlockTime.getTime());
  }

  get firstLeg(): RotationLeg | null {
    return this.orderedLegs[0] ?? null;
  }

  get totalBlockTime(): number {
    return this.legs.reduce((total, leg) => total + leg.blockTime, 0);
  }

  get routeStops(): RouteStop[] {
    const ordered = this.orderedLegs;
    if (ordered.length === 0) {
      return [];
    }
    return [
      { key: `${ordered[0].id}-departure`, iataCode: ordered[0].departure.iataCode },
      ...ordered.map((leg) => ({ key: `${leg.id}-arrival`, iataCode: leg.arrival.iataCode })),
    ];
  }

  get completedLegs(): RotationLeg[] {
    return this.legs.filter((leg) => leg.isFlown);
  }

  containsFlight(flightId: string): boolean {
    return this.legs.some((leg) => leg.flight?.id === flightId);
  }

  get nextLeg(): RotationLeg | null {
    return this.legs.find((leg) => !leg.isFlown) ?? null;
  }

  activeLeg(currentFlightId?: string | null): RotationLeg | null {
    if (currentFlightId) {
      const flying = this.legs.find((leg) => leg.flight?.id === currentFlightId);
      if (flying) {
        return flying;
      }
    }
    return this.nextLeg;
  }

  legStatus(leg: RotationLeg): LegLifecycle {
    if (leg.isFlown) {
      return "done";
    }
    if (leg.id === this.nextLeg?.id) {
      return "active";
    }
    return "upcoming";
  }

  get canMarkReady(): boolean {
    return this.isDraft && this.legs.length >= 2 && this.hasContinuousChain;
  }

  private get hasContinuousChain(): boolean {
    const ordered = this.orderedLegs;

    return ordered.every((leg, index) => {
      const legValid = leg.departure.id !== leg.arrival.id && leg.offBlockTime.getTime() < leg.onBlockTime.getTime();
      if (index === 0) {
        return legValid;
      }
      const previous = ordered[index - 1];
      const chained = leg.departure.id === previous.arrival.id;
      const noOverlap = leg.offBlockTime.getTime() >= previous.onBlockTime.getTime();
      return legValid && chained && noOverlap;
    });
  }
}
