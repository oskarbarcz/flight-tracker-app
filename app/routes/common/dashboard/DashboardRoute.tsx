"use client";

import React from "react";
import { useAuth } from "~/state/contexts/auth.context";
import PilotDashboardRoute from "~/routes/pilot/PilotDashboardRoute";
import OperationsDashboardRoute from "~/routes/common/dashboard/OperationsDashboardRoute";
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
