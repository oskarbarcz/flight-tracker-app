import { HiHome } from "react-icons/hi";
import React from "react";
import { MdLocalAirport, MdOutlineFlightClass } from "react-icons/md";
import { LuTowerControl } from "react-icons/lu";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import SidebarElement from "~/components/Sidebar/SidebarElement";
import SidebarSectionTitle from "~/components/Sidebar/SidebarSectionTitle";
import { GrDocumentTime } from "react-icons/gr";
import { useAuth } from "~/state/contexts/auth.context";
import SidebarLogo from "~/components/Sidebar/SidebarLogo";
import SidebarExpander from "~/components/Sidebar/SidebarExpander";
import SidebarDivider from "~/components/Sidebar/SidebarDivider";
import SidebarThemeSwitch from "~/components/Sidebar/SidebarThemeSwitch";

export function Sidebar({
  isCollapsed,
  handleDesktopCollapse,
}: {
  isCollapsed: boolean;
  handleDesktopCollapse: () => void;
}) {
  const { user } = useAuth();

  return (
    <aside className="flex size-full flex-col bg-gray-100 p-3 dark:bg-gray-800 dark:text-white">
      <SidebarLogo isCollapsed={isCollapsed} />

      <div>
        {isCollapsed && <SidebarDivider />}
        {!isCollapsed && <SidebarSectionTitle label="Flight" />}
        <SidebarElement
          isCollapsed={isCollapsed}
          label="Home"
          href="/"
          icon={HiHome}
        />
        <SidebarElement
          isCollapsed={isCollapsed}
          label="Current flight"
          href="/flights"
          icon={MdOutlineFlightClass}
        />

        {user?.role === "operations" && (
          <>
            {isCollapsed && <SidebarDivider />}
            {!isCollapsed && <SidebarSectionTitle label="Management" />}
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Flight plans"
              href="/flights"
              icon={GrDocumentTime}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Aircraft"
              href="/aircraft"
              icon={MdLocalAirport}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Airports"
              href="/airports"
              icon={LuTowerControl}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Operators"
              href="/operators"
              icon={HiOutlineBuildingOffice}
            />
          </>
        )}
      </div>

      <div className="mt-auto">
        <SidebarThemeSwitch isCollapsed={isCollapsed} />
        <SidebarExpander
          handleDesktopCollapse={handleDesktopCollapse}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
