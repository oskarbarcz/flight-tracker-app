import SidebarDivider from "~/components/shared/Sidebar/Elements/SidebarDivider";
import SidebarLogo from "~/components/shared/Sidebar/Elements/SidebarLogo";
import SidebarSignOutElement from "~/components/shared/Sidebar/Elements/SidebarSignOutElement";
import SidebarThemeSwitch from "~/components/shared/Sidebar/Elements/SidebarThemeSwitch";
import SidebarUserSection from "~/components/shared/Sidebar/Elements/SidebarUserSection";
import CabinCrewSidebarItems from "~/components/shared/Sidebar/Items/CabinCrewSidebarItems";
import OperatorSidebarItems from "~/components/shared/Sidebar/Items/OperationsSidebarItems";
import { UserRole } from "~/models";
import { useAuth } from "~/state/contexts/session/auth.context";

export default function Sidebar() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="w-[300px] flex flex-col text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div>
        <SidebarLogo />
        <SidebarDivider />

        <SidebarUserSection />

        {user.role === UserRole.Operations && <OperatorSidebarItems />}
        {user.role === UserRole.CabinCrew && <CabinCrewSidebarItems />}
      </div>
      <div className="mt-auto">
        <SidebarDivider />
        <nav className="flex flex-col gap-y-1 p-6">
          <SidebarThemeSwitch />
          <SidebarSignOutElement />
        </nav>
      </div>
    </aside>
  );
}
