import { GrDocumentTime } from "react-icons/gr";
import { HiHome } from "react-icons/hi";
import { useLocation } from "react-router";
import { SidebarElement } from "~/components/shared/Sidebar/Elements/SidebarElement";

export function CabinCrewSidebarItems() {
  const path = useLocation().pathname;

  return (
    <nav className="flex flex-col gap-y-1 p-6">
      <SidebarElement label="Home" href="/" isSelected={path === "/"} icon={HiHome} />
      <SidebarElement
        label="Flight history"
        href="/flight-history"
        isSelected={path.startsWith("/flight-history")}
        icon={GrDocumentTime}
      />
    </nav>
  );
}
