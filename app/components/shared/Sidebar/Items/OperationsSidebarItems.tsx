import React, { useEffect, useRef, useState } from "react";
import { FaPlaneDeparture, FaRegClock } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { LuTowerControl } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { useLocation } from "react-router";
import { SidebarElement } from "~/components/shared/Sidebar/Elements/SidebarElement";
import { useApi } from "~/state/api/context/useApi";

export function OperatorSidebarItems() {
  const path = useLocation().pathname;
  const { delayService } = useApi();
  const [pendingDelays, setPendingDelays] = useState(0);
  const lastCountedPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastCountedPath.current === path) {
      return;
    }
    lastCountedPath.current = path;

    let cancelled = false;
    delayService
      .list("pending")
      .then((delayRequests) => {
        if (!cancelled) {
          setPendingDelays(delayRequests.filter((request) => request.hasPendingReports).length);
        }
      })
      .catch((error) => console.error("Failed to load pending delay count", error));
    return () => {
      cancelled = true;
    };
  }, [delayService, path]);

  return (
    <nav className="flex flex-col gap-y-1">
      <SidebarElement
        label="Plan a flight"
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
