import type { JSX } from "react";
import { Outlet } from "react-router";
import { UserRole } from "~/models";
import { AuthGuard } from "~/routes/auth/AuthGuard";

export default function OperationsLayout(): JSX.Element {
  return (
    <AuthGuard allowOnly={UserRole.Operations}>
      <Outlet />
    </AuthGuard>
  );
}
