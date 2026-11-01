import React from "react";
import { DeviceActivation } from "~/features/auth/components/DeviceActivation";
import { AuthGuard } from "~/routes/auth/AuthGuard";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function ActivateRoute() {
  usePageTitle("Transponder sign-in");

  return (
    <AuthGuard loadingFallback={null}>
      <DeviceActivation />
    </AuthGuard>
  );
}
