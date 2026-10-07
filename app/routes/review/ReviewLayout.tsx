import { Outlet } from "react-router";
import { CHANGE_REQUEST_REVIEWERS } from "~/features/change-request/model";
import { AuthGuard } from "~/routes/auth/AuthGuard";

export default function ReviewLayout() {
  return (
    <AuthGuard allowOnly={CHANGE_REQUEST_REVIEWERS}>
      <Outlet />
    </AuthGuard>
  );
}
