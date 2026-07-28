import { UserRole } from "~/features/user/model";

export function landingPathForRole(role: UserRole): string {
  return role === UserRole.Operations ? "/flights" : "/dashboard";
}
