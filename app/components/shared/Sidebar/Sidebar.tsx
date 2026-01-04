import { Drawer, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (user === null) {
    return <div>Loading...</div>;
  }

  const sidebarContent = (closeDrawer?: () => void) => (
    <>
      <div className="flex flex-col h-full">
        <div onClick={closeDrawer}>
          <SidebarLogo />
          <SidebarDivider />

          <SidebarUserSection />

          {user.role === UserRole.Operations && <OperatorSidebarItems />}
          {user.role === UserRole.CabinCrew && <CabinCrewSidebarItems />}
        </div>
        <div className="mt-auto" onClick={closeDrawer}>
          <SidebarDivider />
          <nav className="flex flex-col gap-y-1 p-6">
            <SidebarThemeSwitch />
            <SidebarSignOutElement />
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <SidebarLogo />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
        >
          <HiMenu size={24} />
        </button>
      </div>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="bg-white dark:bg-gray-900 w-80"
      >
        <DrawerItems className="flex flex-col h-full overflow-y-auto">
          {sidebarContent(() => setIsOpen(false))}
        </DrawerItems>
      </Drawer>

      <aside className="hidden md:flex w-[300px] flex-col text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        {sidebarContent()}
      </aside>
    </>
  );
}
