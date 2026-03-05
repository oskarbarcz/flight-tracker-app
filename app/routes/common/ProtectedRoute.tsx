"use client";

import React, { JSX, ReactNode, useContext } from "react";
import { Navigate, useNavigate } from "react-router";
import Splash from "~/layout/common/Splash";
import { UserRole } from "~/models/user.model";
import { AuthContext } from "~/state/contexts/session/auth.context";

type Props = {
  allowedRole?: UserRole;
  children: ReactNode;
};

export default function ProtectedRoute({
  allowedRole,
  children,
}: Props): JSX.Element {
  const { user, isLoading, accessToken } = useContext(AuthContext);

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children as JSX.Element;
}
