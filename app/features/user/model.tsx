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

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentFlightId: string;
  pilotLicenseId: string;
  emails: UserEmail[];
};

export type UserStats = {
  total: {
    blockTime: number;
    totalFlightTime: number;
    totalFuelBurned: number;
    totalGreatCircleDistance: number;
  };
};
