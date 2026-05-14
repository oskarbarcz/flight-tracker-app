import { Drawer, DrawerItems } from "flowbite-react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { CabinCrewSidebarItems } from "~/components/shared/Sidebar/Items/CabinCrewSidebarItems";
import { OperatorSidebarItems } from "~/components/shared/Sidebar/Items/OperationsSidebarItems";
import { TopBarLogo } from "~/components/shared/TopBar/TopBarLogo";
import { UserRole } from "~/models";
import { useAuth } from "~/state/api/context/useAuth";

type SidebarDrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const SidebarDrawerContext = createContext<SidebarDrawerContextValue | null>(null);

export function SidebarDrawerProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return <SidebarDrawerContext.Provider value={value}>{children}</SidebarDrawerContext.Provider>;
}

function useSidebarDrawer(): SidebarDrawerContextValue {
  const ctx = useContext(SidebarDrawerContext);
  if (!ctx) {
    throw new Error("useSidebarDrawer must be used within a SidebarDrawerProvider");
  }
  return ctx;
}

export function SidebarMobileTrigger() {
  const { open } = useSidebarDrawer();

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open menu"
      className="p-2 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
    >
      <HiMenu size={24} />
    </button>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const { isOpen, close } = useSidebarDrawer();

  if (user === null) {
    return <div>Loading...</div>;
  }

  const navItems = (
    <>
      {user.role === UserRole.Operations && <OperatorSidebarItems />}
      {user.role === UserRole.CabinCrew && <CabinCrewSidebarItems />}
    </>
  );

  return (
    <>
      <Drawer open={isOpen} onClose={close} className="bg-gray-100 dark:bg-gray-900 w-80">
        <DrawerItems className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-3 mb-2">
            <TopBarLogo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
            >
              <HiX size={20} />
            </button>
          </div>
          <div role="presentation" onClickCapture={close} className="px-3">
            {navItems}
          </div>
        </DrawerItems>
      </Drawer>

      <aside className="hidden md:flex w-60 flex-col text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 pl-3 pb-3 md:pl-5 md:pb-5 overflow-y-auto">
        {navItems}
      </aside>
    </>
  );
}
