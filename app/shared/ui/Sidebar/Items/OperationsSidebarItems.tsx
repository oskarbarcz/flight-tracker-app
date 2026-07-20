import React from "react";
import { FaPlaneDeparture, FaRegClock } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuTowerControl } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { useLocation } from "react-router";
import { usePendingDelayCount } from "~/features/delay/hooks/usePendingDelays";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";

export function OperatorSidebarItems() {
  const path = useLocation().pathname;
  const pendingDelays = usePendingDelayCount();

  return (
    <nav className="flex flex-col gap-y-1">
      <SidebarElement
        label="Plan new flight"
        href="/flights"
        isSelected={path.startsWith("/flights")}
        icon={GrDocumentTime}
      />
      <SidebarElement
        label="Current flights"
        href="/current-flights"
        isSelected={path.startsWith("/current-flights")}
        icon={FaPlaneDeparture}
      />
      <SidebarElement
        label="Flight history"
        href="/finished-flights"
        isSelected={path.startsWith("/finished-flights")}
        icon={MdHistory}
      />
      <SidebarElement
        label="Delay reviews"
        href="/delays"
        isSelected={path.startsWith("/delays")}
        icon={FaRegClock}
        badge={pendingDelays}
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
