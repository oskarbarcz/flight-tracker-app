import { useCallback, useEffect, useRef, useState } from "react";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import type { ChangeRequest } from "~/features/change-request/model";
import { useApi } from "~/shared/api/useApi";

export type ChangeRequestQueueState = {
  requests: ChangeRequest[];
  isLoading: boolean;
  hasFailed: boolean;
  reload: () => Promise<void>;
  replace: (request: ChangeRequest) => void;
};

export function useChangeRequestQueue(): ChangeRequestQueueState {
  const { changeRequestService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const hasLoaded = useRef(false);

  const reload = useCallback(async () => {
    if (!hasLoaded.current) {
      setIsLoading(true);
    }
    setHasFailed(false);
    try {
      setRequests(await changeRequestService.fetchAll());
      hasLoaded.current = true;
      markRefreshed();
    } catch (error) {
      console.error("Failed to load data change requests", error);
      setHasFailed(true);
    } finally {
      setIsLoading(false);
    }
  }, [changeRequestService, markRefreshed]);

  useEffect(() => {
    reload();
  }, [reload]);

  const replace = useCallback((updated: ChangeRequest) => {
    setRequests((current) => current.map((request) => (request.id === updated.id ? updated : request)));
  }, []);

  return { requests, isLoading, hasFailed, reload, replace };
}
