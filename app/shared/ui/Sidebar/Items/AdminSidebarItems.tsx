import React from "react";
import { LuFileDiff } from "react-icons/lu";
import { useLocation } from "react-router";
import { usePendingChangeRequestCount } from "~/features/change-request/hooks/usePendingChangeRequests";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";
import { SidebarSection } from "~/shared/ui/Sidebar/Elements/SidebarSection";

export function AdminSidebarItems() {
  const path = useLocation().pathname;
  const pendingDataChanges = usePendingChangeRequestCount();

  return (
    <nav className="flex flex-col gap-y-5">
      <SidebarSection label="Review">
        <SidebarElement
          label="Data changes"
          href="/data-changes"
          isSelected={path.startsWith("/data-changes")}
          icon={LuFileDiff}
          badge={pendingDataChanges}
        />
      </SidebarSection>
    </nav>
  );
}
