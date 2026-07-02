import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import PilotDashboardRoute from "~/routes/pilot/PilotDashboardRoute";

export default function DashboardRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (user.role === UserRole.CabinCrew) {
    return <PilotDashboardRoute />;
  }

  if (user.role === UserRole.Operations) {
    return <Navigate to="/flights" replace />;
  }
}
