import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { CHANGE_REQUEST_REVIEWERS, ChangeRequestStatus } from "~/features/change-request/model";
import { useApi } from "~/shared/api/useApi";

type PendingChangeRequests = {
  count: number;
  refresh: () => void;
};

const PendingChangeRequestsContext = createContext<PendingChangeRequests>({ count: 0, refresh: () => {} });

export function PendingChangeRequestsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const path = useLocation().pathname;
  const { changeRequestService } = useApi();
  const [count, setCount] = useState(0);
  const lastCountedPath = useRef<string | null>(null);
  const latestTicket = useRef(0);

  const enabled = user !== null && CHANGE_REQUEST_REVIEWERS.includes(user.role);

  const refresh = useCallback(() => {
    latestTicket.current += 1;
    const ticket = latestTicket.current;
    changeRequestService
      .fetchAll({ status: ChangeRequestStatus.Pending })
      .then((requests) => {
        if (ticket === latestTicket.current) {
          setCount(requests.length);
        }
      })
      .catch((error) => console.error("Failed to load pending data change count", error));
  }, [changeRequestService]);

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
    refresh();
  }, [enabled, path, refresh]);

  const value = useMemo(() => ({ count: enabled ? count : 0, refresh }), [enabled, count, refresh]);

  return <PendingChangeRequestsContext.Provider value={value}>{children}</PendingChangeRequestsContext.Provider>;
}

export function usePendingChangeRequestCount(): number {
  return useContext(PendingChangeRequestsContext).count;
}

export function useRefreshPendingChangeRequests(): () => void {
  return useContext(PendingChangeRequestsContext).refresh;
}
