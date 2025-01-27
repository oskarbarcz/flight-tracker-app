export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  session: string;
};

export enum UserRole {
  Operations = "operations",
  Admin = "admin",
  CabinCrew = "cabincrew",
}
