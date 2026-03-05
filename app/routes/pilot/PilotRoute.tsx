import { JSX } from "react";
import { Outlet } from "react-router";
import { UserRole } from "~/models";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export default function PilotRoute(): JSX.Element {
  return (
    <ProtectedRoute allowedRole={UserRole.CabinCrew}>
      <Outlet />
    </ProtectedRoute>
  );
}
