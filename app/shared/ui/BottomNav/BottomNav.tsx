import React from "react";
import { FaPlaneDeparture, FaRegClock } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiHome, HiOutlineUser } from "react-icons/hi";
import { MdOutlineLocalAirport } from "react-icons/md";
import { TbPlaneInflight } from "react-icons/tb";
import { useLocation } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { usePendingDelayCount } from "~/features/delay/hooks/usePendingDelays";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { UserRole } from "~/features/user";
import { BottomNavTab } from "~/shared/ui/BottomNav/BottomNavTab";

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof BottomNavTab>["icon"];
  to: string | null;
  isActive: boolean;
  badge?: number;
};

function usePilotTabs(path: string): Tab[] {
  const { currentFlight } = useCurrentFlight();

  return [
    {
      label: "Home",
      icon: HiHome,
      to: "/dashboard",
      isActive: path === "/dashboard" || path === "/",
    },
    {
      label: "Track",
      icon: TbPlaneInflight,
      to: currentFlight ? `/track/${currentFlight.id}` : null,
      isActive: path.startsWith("/track"),
    },
    {
      label: "Airports",
      icon: MdOutlineLocalAirport,
      to: "/airports-library",
      isActive: path.startsWith("/airports-library"),
    },
    {
      label: "Profile",
      icon: HiOutlineUser,
      to: "/me",
      isActive:
        path === "/me" ||
        path.startsWith("/flight-history") ||
        path.startsWith("/aircraft-history") ||
        path.startsWith("/travels"),
    },
  ];
}

function useOperationsTabs(path: string): Tab[] {
  const pendingDelays = usePendingDelayCount();

  return [
    {
      label: "Flights",
      icon: GrDocumentTime,
      to: "/flights",
      isActive: path.startsWith("/flights"),
    },
    {
      label: "Current",
      icon: FaPlaneDeparture,
      to: "/current-flights",
      isActive: path.startsWith("/current-flights"),
    },
    {
      label: "Delays",
      icon: FaRegClock,
      to: "/delays",
      isActive: path.startsWith("/delays"),
      badge: pendingDelays,
    },
    {
      label: "Profile",
      icon: HiOutlineUser,
      to: "/me",
      isActive:
        path === "/me" ||
        path.startsWith("/finished-flights") ||
        path.startsWith("/airports") ||
        path.startsWith("/operators"),
    },
  ];
}

export function BottomNav() {
  const { user } = useAuth();
  const path = useLocation().pathname;
  const pilotTabs = usePilotTabs(path);
  const operationsTabs = useOperationsTabs(path);

  if (user === null) {
    return null;
  }

  const tabs = user.role === UserRole.Operations ? operationsTabs : pilotTabs;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-gray-800 dark:bg-gray-900"
    >
      <ul className="flex items-stretch">
        {tabs.map((tab) => (
          <li key={tab.label} className="flex flex-1">
            <BottomNavTab label={tab.label} icon={tab.icon} to={tab.to} isActive={tab.isActive} badge={tab.badge} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
