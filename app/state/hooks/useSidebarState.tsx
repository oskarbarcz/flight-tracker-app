import { useLocalStorage } from "~/state/hooks/useLocalStorage";
import { useCallback } from "react";

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
