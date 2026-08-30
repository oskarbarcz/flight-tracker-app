import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { FaPlane } from "react-icons/fa";
import { FaChartColumn, FaPlaneDeparture, FaRegClock } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiHome, HiOutlineUser } from "react-icons/hi";
import { MdOutlineLocalAirport } from "react-icons/md";
import { useLocation } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { usePendingDelayCount } from "~/features/delay/hooks/usePendingDelays";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { UserRole } from "~/features/user";
import { useInstalledApp } from "~/shared/hooks/useInstalledApp";
import { BottomNavRaisedTab } from "~/shared/ui/BottomNav/BottomNavRaisedTab";
import { BottomNavTab } from "~/shared/ui/BottomNav/BottomNavTab";

type Tab = {
  label: string;
  icon: React.ComponentProps<typeof BottomNavTab>["icon"];
  to: string | null;
  isActive: boolean;
  badge?: number;
  isRaised?: boolean;
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
      label: "Airports",
      icon: MdOutlineLocalAirport,
      to: "/airports-library",
      isActive: path.startsWith("/airports-library"),
    },
    {
      label: "Tracking",
      icon: FaPlane,
      to: currentFlight ? `/track/${currentFlight.id}` : null,
      isActive: path.startsWith("/track"),
      isRaised: true,
    },
    {
      label: "Statistics",
      icon: FaChartColumn,
      to: "/stats",
      isActive: path.startsWith("/stats"),
    },
    {
      label: "Profile",
      icon: HiOutlineUser,
      to: "/me",
      isActive:
        path === "/me" ||
        path.startsWith("/flight-history") ||
        path.startsWith("/aircraft-history") ||
        path.startsWith("/travels") ||
        path.startsWith("/rotations"),
    },
  ];
}

function useOperationsTabs(path: string): Tab[] {
  const pendingDelays = usePendingDelayCount();

  return [
    {
      label: "Flight plans",
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
        path.startsWith("/cabin-layouts") ||
        path.startsWith("/cargo-holds") ||
        path.startsWith("/postcards") ||
        path.startsWith("/operators"),
    },
  ];
}

function adminTabs(path: string): Tab[] {
  return [
    {
      label: "Home",
      icon: HiHome,
      to: "/dashboard",
      isActive: path === "/dashboard" || path === "/",
    },
    {
      label: "Profile",
      icon: HiOutlineUser,
      to: "/me",
      isActive: path.startsWith("/me"),
    },
  ];
}

type RoleTabs = {
  operationsTabs: Tab[];
  pilotTabs: Tab[];
  path: string;
};

function tabsForRole(role: UserRole, { operationsTabs, pilotTabs, path }: RoleTabs): Tab[] {
  switch (role) {
    case UserRole.Operations:
      return operationsTabs;
    case UserRole.CabinCrew:
      return pilotTabs;
    case UserRole.Admin:
      return adminTabs(path);
  }
}

const RAIL_WIDTH = 32;

function useActiveRail(activeIndex: number): {
  listRef: React.RefObject<HTMLUListElement | null>;
  offset: number | null;
} {
  const listRef = useRef<HTMLUListElement>(null);
  const [offset, setOffset] = useState<number | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const item = list?.children[activeIndex];

    if (!(item instanceof HTMLElement)) {
      setOffset(null);
      return;
    }

    setOffset(item.offsetLeft + (item.offsetWidth - RAIL_WIDTH) / 2);
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();

    const list = listRef.current;
    if (list === null) {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(list);

    return () => observer.disconnect();
  }, [measure]);

  return { listRef, offset };
}

export function BottomNav() {
  const { user } = useAuth();
  const path = useLocation().pathname;
  const pilotTabs = usePilotTabs(path);
  const operationsTabs = useOperationsTabs(path);
  const role = user?.role ?? null;
  const tabs = role === null ? [] : tabsForRole(role, { operationsTabs, pilotTabs, path });
  const { listRef, offset } = useActiveRail(tabs.findIndex((tab) => tab.isActive));
  const isInstalledApp = useInstalledApp();

  if (user === null) {
    return null;
  }

  return (
    <nav
      aria-label="Primary"
      className={`bottom-nav ${isInstalledApp ? "bottom-nav-installed" : ""} fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[var(--bottom-nav-safe-bottom)] md:hidden dark:border-gray-800 dark:bg-gray-900`}
    >
      {offset !== null && (
        <span
          aria-hidden
          className="bottom-nav-rail absolute -top-px left-0 h-[3px] rounded-b-full bg-indigo-500"
          style={{ width: `${RAIL_WIDTH}px`, transform: `translateX(${offset}px)` }}
        />
      )}
      <ul ref={listRef} className="flex items-stretch">
        {tabs.map((tab) => (
          <li key={tab.label} className="bottom-nav-slot flex flex-1">
            {tab.isRaised ? (
              <BottomNavRaisedTab label={tab.label} icon={tab.icon} to={tab.to} isActive={tab.isActive} />
            ) : (
              <BottomNavTab label={tab.label} icon={tab.icon} to={tab.to} isActive={tab.isActive} badge={tab.badge} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
