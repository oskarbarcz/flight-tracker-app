"use client";

import { GrDocumentTime } from "react-icons/gr";
import { HiHome } from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuTowerControl } from "react-icons/lu";
import { MdLocalAirport, MdOutlineScreenRotationAlt } from "react-icons/md";
import { useLocation } from "react-router";
import Container from "~/components/shared/Layout/Container";
import SidebarCurrentFlight from "~/components/shared/Sidebar/SidebarCurrentFlight";
import SidebarDivider from "~/components/shared/Sidebar/SidebarDivider";
import SidebarElement from "~/components/shared/Sidebar/SidebarElement";
import SidebarExpander from "~/components/shared/Sidebar/SidebarExpander";
import SidebarLogo from "~/components/shared/Sidebar/SidebarLogo";
import SidebarSectionTitle from "~/components/shared/Sidebar/SidebarSectionTitle";
import SidebarThemeSwitch from "~/components/shared/Sidebar/SidebarThemeSwitch";
import SidebarUserPanel from "~/components/shared/Sidebar/SidebarUserPanel";
import { User, UserRole } from "~/models/user.model";
import { TrackedFlightProvider } from "~/state/contexts/global/tracked-flight.context";
import { useAuth } from "~/state/contexts/session/auth.context";

export function Sidebar({
  isCollapsed,
  handleDesktopCollapse,
}: {
  isCollapsed: boolean;
  handleDesktopCollapse: () => void;
}) {
  const path = useLocation().pathname;
  const { user } = useAuth() as { user: User };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      className="flex flex-col min-h-[600px] h-min w-full"
      padding="condensed"
    >
      <SidebarLogo isCollapsed={isCollapsed} />

      <div className="text-white mb-4">
        {user.currentFlightId && (
          <>
            {isCollapsed && <SidebarDivider />}
            {!isCollapsed && <SidebarSectionTitle label="Current flight" />}
            <TrackedFlightProvider>
              <SidebarCurrentFlight
                flightId={user.currentFlightId}
                isCollapsed={isCollapsed}
              />
            </TrackedFlightProvider>
          </>
        )}

        {user.role === UserRole.CabinCrew && (
          <>
            {isCollapsed && <SidebarDivider />}
            {!isCollapsed && <SidebarSectionTitle label="Flight" />}
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Home"
              href="/"
              isSelected={path === "/"}
              icon={HiHome}
            />
          </>
        )}

        {user.role === UserRole.Operations && (
          <>
            {isCollapsed && <SidebarDivider />}
            {!isCollapsed && <SidebarSectionTitle label="Management" />}
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Flight plans"
              href="/flights"
              isSelected={path.startsWith("/flights")}
              icon={GrDocumentTime}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Rotations"
              href="/rotations"
              isSelected={path.startsWith("/rotations")}
              icon={MdOutlineScreenRotationAlt}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Aircraft"
              href="/aircraft"
              isSelected={path.startsWith("/aircraft")}
              icon={MdLocalAirport}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Airports"
              href="/airports"
              isSelected={path.startsWith("/airports")}
              icon={LuTowerControl}
            />
            <SidebarElement
              isCollapsed={isCollapsed}
              label="Operators"
              href="/operators"
              isSelected={path.startsWith("/operators")}
              icon={HiOutlineBuildingOffice}
            />
          </>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <SidebarUserPanel isCollapsed={isCollapsed} />
        <SidebarThemeSwitch isCollapsed={isCollapsed} />
        <SidebarExpander
          handleDesktopCollapse={handleDesktopCollapse}
          isCollapsed={isCollapsed}
        />
      </div>
    </Container>
  );
}
