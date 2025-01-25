export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  Operations = "operations",
  Admin = "admin",
  CabinCrew = "cabincrew",
}
