import React from "react";
import {
  LuArmchair,
  LuBuilding2,
  LuClock,
  LuContainer,
  LuFileClock,
  LuFileDiff,
  LuHistory,
  LuImage,
  LuPlaneTakeoff,
  LuTowerControl,
} from "react-icons/lu";
import { useLocation } from "react-router";
import { usePendingChangeRequestCount } from "~/features/change-request/hooks/usePendingChangeRequests";
import { usePendingDelayCount } from "~/features/delay/hooks/usePendingDelays";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";
import { SidebarSection } from "~/shared/ui/Sidebar/Elements/SidebarSection";

export function OperatorSidebarItems() {
  const path = useLocation().pathname;
  const pendingDelays = usePendingDelayCount();
  const pendingDataChanges = usePendingChangeRequestCount();

  return (
    <nav className="flex flex-col gap-y-5">
      <SidebarSection label="Planning">
        <SidebarElement
          label="Flight plans"
          href="/flights"
          isSelected={path.startsWith("/flights")}
          icon={LuFileClock}
        />
      </SidebarSection>

      <SidebarSection label="Management">
        <SidebarElement
          label="Current flights"
          href="/current-flights"
          isSelected={path.startsWith("/current-flights")}
          icon={LuPlaneTakeoff}
        />
        <SidebarElement
          label="Delay reviews"
          href="/delays"
          isSelected={path.startsWith("/delays")}
          icon={LuClock}
          badge={pendingDelays}
        />
        <SidebarElement
          label="Data changes"
          href="/data-changes"
          isSelected={path.startsWith("/data-changes")}
          icon={LuFileDiff}
          badge={pendingDataChanges}
        />
        <SidebarElement
          label="Flight history"
          href="/finished-flights"
          isSelected={path.startsWith("/finished-flights")}
          icon={LuHistory}
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
          icon={LuBuilding2}
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
