"use client";

import React from "react";
import { useAuth } from "~/state/contexts/session/auth.context";
import PilotDashboardRoute from "~/routes/pilot/PilotDashboardRoute";
import OperationsDashboardRoute from "~/routes/operations/OperationsDashboardRoute";
import { UserRole } from "~/models";

export default function DashboardRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (user.role === UserRole.CabinCrew) {
    return <PilotDashboardRoute />;
  }

  if (user.role === UserRole.Operations) {
    return <OperationsDashboardRoute />;
  }
}
