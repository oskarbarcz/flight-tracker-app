"use client";

import React from "react";
import {Navigate} from "react-router";

export default function OperationsDashboardRoute() {
  return <Navigate to={"/flights"} replace={true} />;
}
