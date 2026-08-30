import React from "react";
import { FaPlaneDeparture, FaRegClock } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuArmchair, LuContainer, LuImage, LuTowerControl } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { useLocation } from "react-router";
import { usePendingDelayCount } from "~/features/delay/hooks/usePendingDelays";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";
import { SidebarSection } from "~/shared/ui/Sidebar/Elements/SidebarSection";

export function OperatorSidebarItems() {
  const path = useLocation().pathname;
  const pendingDelays = usePendingDelayCount();

  return (
    <nav className="flex flex-col gap-y-5">
      <SidebarSection label="Planning">
        <SidebarElement
          label="Flight plans"
          href="/flights"
          isSelected={path.startsWith("/flights")}
          icon={GrDocumentTime}
        />
      </SidebarSection>

      <SidebarSection label="Management">
        <SidebarElement
          label="Current flights"
          href="/current-flights"
          isSelected={path.startsWith("/current-flights")}
          icon={FaPlaneDeparture}
        />
        <SidebarElement
          label="Review delays"
          href="/delays"
          isSelected={path.startsWith("/delays")}
          icon={FaRegClock}
          badge={pendingDelays}
        />
        <SidebarElement
          label="Flights history"
          href="/finished-flights"
          isSelected={path.startsWith("/finished-flights")}
          icon={MdHistory}
        />
      </SidebarSection>

      <SidebarSection label="Area">
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
      </SidebarSection>

      <SidebarSection label="Resources">
        <SidebarElement
          label="Cabin layouts"
          href="/cabin-layouts"
          isSelected={path.startsWith("/cabin-layouts")}
          icon={LuArmchair}
        />
        <SidebarElement
          label="Cargo holds"
          href="/cargo-holds"
          isSelected={path.startsWith("/cargo-holds")}
          icon={LuContainer}
        />
        <SidebarElement label="Postcards" href="/postcards" isSelected={path.startsWith("/postcards")} icon={LuImage} />
      </SidebarSection>
    </nav>
  );
}
