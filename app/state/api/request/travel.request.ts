import type { TravelStatus, TravelType } from "~/models/travel.model";

export type ApiUserTravelAirport = {
  id: string;
  name: string;
  iataCode: string;
};

export type ApiUserTravelResponse = {
  id: string;
  userId: string;
  type: TravelType;
  status: TravelStatus;
  departureAirport: ApiUserTravelAirport;
  destinationAirport: ApiUserTravelAirport;
  distance: number;
  flightId: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateTravelRequest = {
  destinationAirportId: string;
};
