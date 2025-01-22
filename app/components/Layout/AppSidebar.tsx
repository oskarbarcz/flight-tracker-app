import {Button, Sidebar} from "flowbite-react";
import {
  HiChevronDoubleLeft,
  HiHome,
} from "react-icons/hi";
import React from "react";
import {MdLocalAirport, MdOutlineFlightClass} from "react-icons/md";
import {LuTowerControl} from "react-icons/lu";
import {HiOutlineBuildingOffice} from "react-icons/hi2";
import SidebarElement from "~/components/Sidebar/SidebarElement";
import SidebarSectionTitle from "~/components/Sidebar/SidebarSectionTitle";
import {GrDocumentTime} from "react-icons/gr";
import {useAuth} from "~/state/contexts/auth.context";

export function AppSidebar({
  isCollapsed,
  handleDesktopCollapse,
}: {
  isCollapsed: boolean;
  handleDesktopCollapse: () => void;
}) {
  const {user} = useAuth();

  return (
    <Sidebar className="size-full">
      <Sidebar.Logo
        className="mb-20"
        href="#"
        img="https://flowbite.com/docs/images/logo.svg"
        imgAlt="Flowbite Logo"
      >
        {!isCollapsed && <span className="text-gray-800">Flight Tracker</span>}
      </Sidebar.Logo>

      <div>
        <SidebarSectionTitle isCollapsed={isCollapsed} label="Flight"/>
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

        { user?.role === 'operations' && <>
          <SidebarSectionTitle isCollapsed={isCollapsed} label="Management"/>
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
        </>}
      </div>

      <div className="flex p-2">

        <Button
          color="light"
          size="sm"
          onClick={handleDesktopCollapse}
          className="hidden md:flex"
        >
          <HiChevronDoubleLeft
            className={`size-5 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </Sidebar>
  );
}
