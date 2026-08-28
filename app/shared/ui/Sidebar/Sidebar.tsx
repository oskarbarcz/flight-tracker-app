import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import { SidebarClock } from "~/shared/ui/Sidebar/Elements/SidebarClock";
import { CabinCrewSidebarItems } from "~/shared/ui/Sidebar/Items/CabinCrewSidebarItems";
import { OperatorSidebarItems } from "~/shared/ui/Sidebar/Items/OperationsSidebarItems";
import { SettingsSidebarItems } from "~/shared/ui/Sidebar/Items/SettingsSidebarItems";
import { TopBarLogo } from "~/shared/ui/TopBar/TopBarLogo";
import { TopBarUserTile } from "~/shared/ui/TopBar/TopBarUserTile";

export function Sidebar() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="hidden md:flex h-full w-60 shrink-0 flex-col text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 px-3 pt-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] md:px-4 xl:w-72">
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
  );
}
