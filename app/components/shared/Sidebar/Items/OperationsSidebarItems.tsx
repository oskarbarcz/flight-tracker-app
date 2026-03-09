import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuTowerControl } from "react-icons/lu";
import { useLocation } from "react-router";
import { SidebarElement } from "~/components/shared/Sidebar/Elements/SidebarElement";

export function OperatorSidebarItems() {
  const path = useLocation().pathname;

  return (
    <nav className="flex flex-col gap-y-1 p-6">
      <SidebarElement
        label="Flight plans"
        href="/flights"
        isSelected={path.startsWith("/flights")}
        icon={GrDocumentTime}
      />
      <SidebarElement
        label="Airports"
        href="/airports"
        isSelected={path.startsWith("/airports")}
        icon={LuTowerControl}
      />
      <SidebarElement
        label="Operators"
        href="/operators"
        isSelected={path.startsWith("/operators")}
        icon={HiOutlineBuildingOffice}
      />
    </nav>
  );
}
