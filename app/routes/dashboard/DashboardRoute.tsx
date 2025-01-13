"use client";

import React from "react";
import { Navigate } from "react-router";
import {useAuth} from "~/state/contexts/auth.context";
import CabinCrewDashboardRoute from "~/routes/dashboard/CabinCrewDashboardRoute";
import OperationsDashboardRoute from "~/routes/dashboard/OperationsDashboardRoute";

export default function DashboardRoute() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>
  }

  if (user.role === "cabincrew") {
    return <CabinCrewDashboardRoute />;
  }

  if (user.role === "operations") {
    return <OperationsDashboardRoute />;
  }
}
