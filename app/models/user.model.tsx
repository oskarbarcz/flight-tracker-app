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
};

export type GetUserResponse = User;
