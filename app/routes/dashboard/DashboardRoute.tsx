"use client";

import React from "react";
import { useAuth } from "~/state/contexts/auth.context";
import CabinCrewDashboardRoute from "~/routes/dashboard/CabinCrewDashboardRoute";
import OperationsDashboardRoute from "~/routes/dashboard/OperationsDashboardRoute";
import { UserRole } from "~/models";

export default function DashboardRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (user.role === UserRole.Admin) {
    return <CabinCrewDashboardRoute />;
  }

  if (user.role === UserRole.Operations) {
    return <OperationsDashboardRoute />;
  }
}
