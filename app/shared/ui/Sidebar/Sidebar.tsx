import { useAuth } from "~/app-state/useAuth";
import { useSidebar } from "~/app-state/useSidebar";
import { UserRole } from "~/features/user";
import { SidebarClock } from "~/shared/ui/Sidebar/Elements/SidebarClock";
import { SidebarTab } from "~/shared/ui/Sidebar/Elements/SidebarTab";
import { CabinCrewSidebarItems } from "~/shared/ui/Sidebar/Items/CabinCrewSidebarItems";
import { OperatorSidebarItems } from "~/shared/ui/Sidebar/Items/OperationsSidebarItems";
import { SettingsSidebarItems } from "~/shared/ui/Sidebar/Items/SettingsSidebarItems";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";
import { TopBarUserTile } from "~/shared/ui/TopBar/TopBarUserTile";

export function Sidebar() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group relative hidden w-60 shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[collapsed=true]:w-0 data-[collapsed=true]:duration-200 motion-reduce:transition-none md:block xl:w-72"
    >
      <div className="h-full overflow-hidden">
        <aside
          inert={isCollapsed}
          className="flex h-full w-60 flex-col border-e border-gray-200 bg-white px-3 pt-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] text-gray-700 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[collapsed=true]:-translate-x-full group-data-[collapsed=true]:duration-200 motion-reduce:transition-none md:px-4 xl:w-72 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <div className="mb-4 flex flex-col items-center gap-3 px-2">
            <TopBarLogo />
            <hr className="w-full border-gray-200 dark:border-gray-800" />
            <SidebarClock />
            <hr className="w-full border-gray-200 dark:border-gray-800" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-y-5 overflow-y-auto">
            {user.role === UserRole.Operations && <OperatorSidebarItems />}
            {user.role === UserRole.CabinCrew && <CabinCrewSidebarItems />}
            <SettingsSidebarItems />
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
            <TopBarUserTile />
          </div>
        </aside>
      </div>
      <SidebarTab />
    </div>
  );
}
