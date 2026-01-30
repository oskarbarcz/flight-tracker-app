export enum UserRole {
  Operations = "Operations",
  Admin = "Admin",
  CabinCrew = "CabinCrew",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentFlightId: string;
  pilotLicenseId: string;
};

export type UserStats = {
  total: {
    blockTime: number;
  };
};

export type GetUserResponse = User;
export type ListUsersResponse = User[];
