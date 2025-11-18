"use client";

import React from "react";
import { UserRole } from "~/models";
import OperationsDashboardRoute from "~/routes/operations/OperationsDashboardRoute";
import PilotDashboardRoute from "~/routes/pilot/PilotDashboardRoute";
import { useAuth } from "~/state/contexts/session/auth.context";

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
