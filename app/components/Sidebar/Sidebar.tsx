import { HiHome } from "react-icons/hi";
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
import SidebarUserPanel from "~/components/Sidebar/SidebarUserPanel";
import { User, UserRole } from "~/models/user.model";
import SidebarCurrentFlight from "~/components/Sidebar/SidebarCurrentFlight";

export function Sidebar({
  isCollapsed,
  handleDesktopCollapse,
}: {
  isCollapsed: boolean;
  handleDesktopCollapse: () => void;
}) {
  const { user } = useAuth() as { user: User };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="flex size-full flex-col bg-gray-100 p-3 text-gray-800 dark:bg-gray-800 dark:text-white">
      <SidebarLogo isCollapsed={isCollapsed} />

      <div>
        {user.currentFlightId && (
          <>
            {isCollapsed && <SidebarDivider />}
            {!isCollapsed && <SidebarSectionTitle label="Current flight" />}
            <SidebarCurrentFlight flightId={user.currentFlightId} />
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
        <SidebarUserPanel isCollapsed={isCollapsed} />
        <SidebarThemeSwitch isCollapsed={isCollapsed} />
        <SidebarExpander
          handleDesktopCollapse={handleDesktopCollapse}
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
