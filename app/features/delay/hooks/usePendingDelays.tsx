import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";
import { useApi } from "~/shared/api/useApi";

const PendingDelaysContext = createContext<number>(0);

export function PendingDelaysProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const path = useLocation().pathname;
  const { delayService } = useApi();
  const [count, setCount] = useState(0);
  const lastCountedPath = useRef<string | null>(null);

  const enabled = user?.role === UserRole.Operations;

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      lastCountedPath.current = null;
      return;
    }
    if (lastCountedPath.current === path) {
      return;
    }
    lastCountedPath.current = path;

    let cancelled = false;
    delayService
      .list("pending")
      .then((delayRequests) => {
        if (!cancelled) {
          setCount(delayRequests.filter((request) => request.hasPendingReports).length);
        }
      })
      .catch((error) => console.error("Failed to load pending delay count", error));
    return () => {
      cancelled = true;
    };
  }, [enabled, delayService, path]);

  return <PendingDelaysContext.Provider value={enabled ? count : 0}>{children}</PendingDelaysContext.Provider>;
}

export function usePendingDelayCount(): number {
  return useContext(PendingDelaysContext);
}
