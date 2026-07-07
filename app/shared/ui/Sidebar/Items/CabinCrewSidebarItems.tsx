import { FaMapLocationDot } from "react-icons/fa6";
import { GrDocumentTime } from "react-icons/gr";
import { HiHome } from "react-icons/hi";
import { LuPlane } from "react-icons/lu";
import { useLocation } from "react-router";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";

export function CabinCrewSidebarItems() {
  const path = useLocation().pathname;

  return (
    <nav className="flex flex-col gap-y-1">
      <SidebarElement label="Home" href="/" isSelected={path === "/"} icon={HiHome} />
      <SidebarElement
        label="Flight history"
        href="/flight-history"
        isSelected={path.startsWith("/flight-history")}
        icon={GrDocumentTime}
      />
      <SidebarElement
        label="Aircraft history"
        href="/aircraft-history"
        isSelected={path.startsWith("/aircraft-history")}
        icon={LuPlane}
      />
      <SidebarElement
        label="Travel log"
        href="/travels"
        isSelected={path.startsWith("/travels")}
        icon={FaMapLocationDot}
      />
    </nav>
  );
}
