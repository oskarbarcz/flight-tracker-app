import React, { type JSX, type ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { UseAuth } from "~/app-state/useAuth";
import type { UserRole } from "~/features/user/model";
import Splash from "~/routes/common/Splash";
import { signInPathReturningTo } from "~/shared/lib/signInReturn";

type Props = {
  allowOnly?: UserRole | UserRole[];
  loadingFallback?: ReactNode;
  children: ReactNode;
};

function isAllowed(role: UserRole, allowOnly: UserRole | UserRole[]): boolean {
  return Array.isArray(allowOnly) ? allowOnly.includes(role) : role === allowOnly;
}

export function AuthGuard({ allowOnly, loadingFallback = <Splash />, children }: Props) {
  const { user, isLoading, accessToken } = useContext(UseAuth);
  const location = useLocation();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!user || !accessToken) {
    const requestedPath = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate to={signInPathReturningTo(requestedPath)} replace />;
  }

  if (allowOnly && !isAllowed(user.role, allowOnly)) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}
