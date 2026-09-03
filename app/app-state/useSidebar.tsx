import React, { createContext, useCallback, useContext } from "react";
import { useLocalStorage } from "~/shared/hooks/useLocalStorage";

type SidebarContextType = {
  isCollapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggle: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function SidebarProvider({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>("sidebar-collapsed", false);

  const toggle = useCallback(() => setIsCollapsed((collapsed) => !collapsed), [setIsCollapsed]);

  return <SidebarContext.Provider value={{ isCollapsed, toggle }}>{children}</SidebarContext.Provider>;
}

export const useSidebar = () => useContext(SidebarContext);
