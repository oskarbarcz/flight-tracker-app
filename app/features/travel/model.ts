import type { ApiUserTravelAirport, ApiUserTravelResponse } from "~/features/travel/request";

export enum TravelType {
  PerformingFlight = "performing_flight",
  DeadHeadManual = "dead_head_manual",
  DeadHeadAutomatic = "dead_head_automatic",
}

export enum TravelStatus {
  Pending = "pending",
  Finished = "finished",
}

export const travelTypeLabel: Record<TravelType, string> = {
  [TravelType.PerformingFlight]: "Performing flight",
  [TravelType.DeadHeadManual]: "Manual dead-head",
  [TravelType.DeadHeadAutomatic]: "Automatic dead-head",
};

export const travelStatusLabel: Record<TravelStatus, string> = {
  [TravelStatus.Pending]: "Pending",
  [TravelStatus.Finished]: "Finished",
};

export type UserTravelAirport = ApiUserTravelAirport;

export class UserTravel {
  id: string;
  userId: string;
  type: TravelType;
  status: TravelStatus;
  departureAirport: UserTravelAirport;
  destinationAirport: UserTravelAirport;
  distance: number;
  flightId: string | null;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(data: ApiUserTravelResponse) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.status = data.status;
    this.departureAirport = data.departureAirport;
    this.destinationAirport = data.destinationAirport;
    this.distance = data.distance;
    this.flightId = data.flightId;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  }

  get isPending(): boolean {
    return this.status === TravelStatus.Pending;
  }

  get isFinished(): boolean {
    return this.status === TravelStatus.Finished;
  }

  get isManualDeadHead(): boolean {
    return this.type === TravelType.DeadHeadManual;
  }

  get typeLabel(): string {
    return travelTypeLabel[this.type];
  }

  get statusLabel(): string {
    return travelStatusLabel[this.status];
  }
}
