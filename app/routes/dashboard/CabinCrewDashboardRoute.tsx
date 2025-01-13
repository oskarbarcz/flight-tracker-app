"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import PilotInformationBox from "~/components/PilotInformationBox/PilotInformationBox";
export default function CabinCrewDashboardRoute() {

  return <>
    <ProtectedRoute expectedRole="cabincrew">
      <div className="mt-4 grid grid-cols-2 gap-4">
        <PilotInformationBox />
      </div>
    </ProtectedRoute>
  </>;
}
