import { UserRole } from "~/features/user/model";

export function landingPathForRole(role: UserRole): string {
  switch (role) {
    case UserRole.Operations:
      return "/flights";
    case UserRole.Admin:
      return "/data-changes";
    case UserRole.CabinCrew:
      return "/dashboard";
  }
}
