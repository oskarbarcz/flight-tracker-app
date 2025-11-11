"use client";
import { useAuth } from "~/state/contexts/session/auth.context";
import { User, UserRole } from "~/models/user.model";
import { useLocation } from "react-router";
import { MdLocalAirport, MdOutlineScreenRotationAlt } from "react-icons/md";
import { LuTowerControl } from "react-icons/lu";
import SidebarElement from "~/components/Sidebar/SidebarElement";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import SidebarUserPanel from "~/components/Sidebar/SidebarUserPanel";
import SidebarThemeSwitch from "~/components/Sidebar/SidebarThemeSwitch";
import { HiHome } from "react-icons/hi";

export function MobileSidebar() {
  const path = useLocation().pathname;
  const { user } = useAuth() as { user: User };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="md:hidden overflow-x-auto py-2 w-full fixed bottom-0 shadow-4xl bg-white dark:bg-gray-800 border-indigo-100 dark:border-gray-700 text-gray-800 dark:text-gray-300 shadow-indigo-200 dark:shadow-gray-900">
      <div className="flex mx-2 gap-4 overflow-x-auto">
        <SidebarUserPanel isCollapsed={false} />

        {user.role === UserRole.CabinCrew && (
          <>
            <SidebarElement
              isCollapsed={false}
              label="Home"
              href="/"
              isSelected={path === "/"}
              icon={HiHome}
            />
          </>
        )}

        {user.role === UserRole.Operations && (
          <>
            <SidebarElement
              isCollapsed={false}
              label="Flight plans"
              href="/flights"
              isSelected={path.startsWith("/flights")}
              icon={GrDocumentTime}
            />
            <SidebarElement
              isCollapsed={false}
              label="Rotations"
              href="/rotations"
              isSelected={path.startsWith("/rotations")}
              icon={MdOutlineScreenRotationAlt}
            />
            <SidebarElement
              isCollapsed={false}
              label="Aircraft"
              href="/aircraft"
              isSelected={path.startsWith("/aircraft")}
              icon={MdLocalAirport}
            />
            <SidebarElement
              isCollapsed={false}
              label="Airports"
              href="/airports"
              isSelected={path.startsWith("/airports")}
              icon={LuTowerControl}
            />
            <SidebarElement
              isCollapsed={false}
              label="Operators"
              href="/operators"
              isSelected={path.startsWith("/operators")}
              icon={HiOutlineBuildingOffice}
            />
          </>
        )}

        <SidebarThemeSwitch isCollapsed={true} />
      </div>
    </nav>
  );
}
