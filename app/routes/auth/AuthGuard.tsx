"use client";

import React, { type JSX, type ReactNode, useContext } from "react";
import { Navigate } from "react-router";
import type { UserRole } from "~/models/user.model";
import Splash from "~/routes/common/Splash";
import { UseAuth } from "~/state/api/context/useAuth";

type Props = {
  allowOnly?: UserRole;
  children: ReactNode;
};

export function AuthGuard({ allowOnly, children }: Props): JSX.Element {
  const { user, isLoading, accessToken } = useContext(UseAuth);

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowOnly && user.role !== allowOnly) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children as JSX.Element;
}
