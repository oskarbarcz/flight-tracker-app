import { HiHome } from "react-icons/hi";
import { useLocation } from "react-router";
import SidebarElement from "~/components/shared/Sidebar/Elements/SidebarElement";

export default function CabinCrewSidebarItems() {
  const path = useLocation().pathname;

  return (
    <nav className="flex flex-col gap-y-1 p-6">
      <SidebarElement
        label="Home"
        href="/"
        isSelected={path === "/"}
        icon={HiHome}
      />
    </nav>
  );
}
