import React, { type JSX, type ReactNode, useContext } from "react";
import { Navigate } from "react-router";
import { UseAuth } from "~/app-state/useAuth";
import type { UserRole } from "~/features/user/model";
import Splash from "~/routes/common/Splash";

type Props = {
  allowOnly?: UserRole | UserRole[];
  children: ReactNode;
};

function isAllowed(role: UserRole, allowOnly: UserRole | UserRole[]): boolean {
  return Array.isArray(allowOnly) ? allowOnly.includes(role) : role === allowOnly;
}

export function AuthGuard({ allowOnly, children }: Props) {
  const { user, isLoading, accessToken } = useContext(UseAuth);

  if (isLoading) {
    return <Splash />;
  }

  if (!user || !accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowOnly && !isAllowed(user.role, allowOnly)) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}
