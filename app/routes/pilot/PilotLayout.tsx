import { Outlet } from "react-router";
import { UserRole } from "~/models";
import { AuthGuard } from "~/routes/auth/AuthGuard";

export default function PilotLayout() {
  return (
    <AuthGuard allowOnly={UserRole.CabinCrew}>
      <Outlet />
    </AuthGuard>
  );
}
