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
}

export type LegLifecycle = "done" | "active" | "upcoming";

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

  get hasFlight(): boolean {
    return this.flight !== null;
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
  legs: RotationLeg[];
  createdAt: Date;
  updatedAt: Date | null;

  constructor(rotation: ApiRotationResponse) {
    this.id = rotation.id;
    this.name = rotation.name;
    this.operatorId = rotation.operatorId;
    this.pilotId = rotation.pilotId;
    this.status = rotation.status;
    this.createdBy = rotation.createdBy;
    this.updatedBy = rotation.updatedBy;
    this.legs = rotation.legs.map((leg) => new RotationLeg(leg));
    this.createdAt = new Date(rotation.createdAt);
    this.updatedAt = rotation.updatedAt ? new Date(rotation.updatedAt) : null;
  }

  get isDraft(): boolean {
    return this.status === RotationStatus.Draft;
  }

  get isReady(): boolean {
    return this.status === RotationStatus.Ready;
  }

  get isActive(): boolean {
    return this.status === RotationStatus.Ready || this.status === RotationStatus.InProgress;
  }

  get isFinished(): boolean {
    return this.status === RotationStatus.Finished;
  }

  get completedLegs(): RotationLeg[] {
    return this.legs.filter((leg) => leg.isFlown);
  }

  get legsWithoutFlight(): RotationLeg[] {
    return this.legs.filter((leg) => !leg.hasFlight);
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

  get progress(): number {
    if (this.legs.length === 0) {
      return 0;
    }
    return this.completedLegs.length / this.legs.length;
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
    const ordered = [...this.legs].sort((a, b) => a.offBlockTime.getTime() - b.offBlockTime.getTime());

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
