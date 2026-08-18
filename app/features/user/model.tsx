import type { WeatherSource } from "~/features/airport/model";

export enum UserRole {
  Operations = "Operations",
  Admin = "Admin",
  CabinCrew = "CabinCrew",
}

export type UserEmail = {
  email: string;
  isConfirmed: boolean;
  active: boolean;
};

export type GoogleIdentity = {
  linked: boolean;
  email?: string | null;
};

export type DiscordIdentity = {
  linked: boolean;
  userId?: string;
  username?: string;
  globalName?: string | null;
  avatarUrl?: string | null;
};

export type UserIdentities = {
  google: GoogleIdentity;
  discord: DiscordIdentity;
};

export type DiscordJoinOutcome = "joined" | "already_member" | "not_requested" | "failed";

export type DiscordServerMembershipStatus = "member" | "not_member" | "unknown";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentFlightId: string;
  pilotLicenseId: string;
  simbriefUserId: string | null;
  emails: UserEmail[];
  identities: UserIdentities;
  defaultWeatherSource: WeatherSource;
};

export type SimbriefAirport = {
  icaoCode: string;
  iataCode: string | null;
  name: string | null;
};

export type SimbriefAircraft = {
  registration: string | null;
  type: string | null;
  name: string | null;
};

export type SimbriefFlight = {
  callsign: string;
  origin: SimbriefAirport;
  destination: SimbriefAirport;
  scheduledOffBlockTime: string | null;
  scheduledOnBlockTime: string | null;
  aircraft: SimbriefAircraft;
  generatedAt: string | null;
};

export type SimbriefAccount = {
  simbriefUserId: string;
  latestFlight: SimbriefFlight;
};

export type UserStats = {
  total: {
    blockTime: number;
    totalFlightTime: number;
    totalFuelBurned: number;
    totalGreatCircleDistance: number;
  };
};
