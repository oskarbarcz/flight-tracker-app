import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { useLocation } from "react-router";
import { SidebarElement } from "~/shared/ui/Sidebar/Elements/SidebarElement";
import { SidebarSection } from "~/shared/ui/Sidebar/Elements/SidebarSection";

export function SettingsSidebarItems() {
  const path = useLocation().pathname;

  return (
    <SidebarSection label="Your account">
      <SidebarElement
        label="Settings"
        href="/me/account"
        isSelected={path === "/me/account"}
        icon={HiOutlineCog6Tooth}
      />
    </SidebarSection>
  );
}
