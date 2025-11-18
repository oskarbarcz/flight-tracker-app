import { useCallback } from "react";
import { useLocalStorage } from "~/state/hooks/useLocalStorage";

type SidebarCollapseState = boolean;
type SidebarCollapseStateHook = [SidebarCollapseState, () => void];

export function useSidebarState(): SidebarCollapseStateHook {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "is_sidebar_collapsed",
    false,
  );

  const handleCollapseToggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, [setIsCollapsed]);

  return [isCollapsed, handleCollapseToggle];
}
