"use client";

import React, { JSX, ReactNode, useContext } from "react";
import { Navigate } from "react-router";
import { UserRole } from "~/models/user.model";
import Splash from "~/routes/common/Splash";
import { AuthContext } from "~/state/contexts/session/auth.context";

type Props = {
  allowOnly?: UserRole;
  children: ReactNode;
};

export function AuthGuard({ allowOnly, children }: Props): JSX.Element {
  const { user, isLoading, accessToken } = useContext(AuthContext);

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
