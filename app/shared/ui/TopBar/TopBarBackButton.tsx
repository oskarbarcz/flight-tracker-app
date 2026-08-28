import { HiOutlineChevronLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import { landingPathForRole } from "~/features/user/lib/landingPath";

const mainPaths: Record<UserRole, string[]> = {
  [UserRole.Operations]: ["/flights", "/current-flights", "/delays", "/me"],
  [UserRole.CabinCrew]: ["/dashboard", "/airports-library", "/stats", "/me"],
  [UserRole.Admin]: ["/dashboard", "/me"],
};

const trackedFlightPath = /^\/track\/[^/]+$/;

function isMainPath(path: string, role: UserRole): boolean {
  if (role === UserRole.CabinCrew && trackedFlightPath.test(path)) {
    return true;
  }

  return mainPaths[role].includes(path);
}

function hasPreviousEntry(): boolean {
  const index = (window.history.state as { idx?: unknown } | null)?.idx;

  return typeof index === "number" && index > 0;
}

export function TopBarBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (user === null || isMainPath(pathname, user.role)) {
    return null;
  }

  const goBack = () => {
    if (hasPreviousEntry()) {
      navigate(-1);
      return;
    }

    navigate(landingPathForRole(user.role), { replace: true });
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-gray-400 dark:hover:text-indigo-400"
    >
      <HiOutlineChevronLeft className="size-6" />
    </button>
  );
}
