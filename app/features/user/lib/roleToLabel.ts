import { UserRole } from "~/features/user/model";

export function roleToLabel(role: UserRole): string {
  switch (role) {
    case UserRole.Operations:
      return "Dispatcher · OCC";
    case UserRole.Admin:
      return "Administrator";
    case UserRole.CabinCrew:
      return "Cabin crew";
  }
}
