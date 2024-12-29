export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserRole = "admin" | "operations" | "cabin_crew";
