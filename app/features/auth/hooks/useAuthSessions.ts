import { useCallback, useEffect, useState } from "react";
import type { AuthSession } from "~/features/auth/model";
import { isNotFound } from "~/shared/api/api.service";
import { useApi } from "~/shared/api/useApi";

export type AuthSessionsControl = {
  sessions: AuthSession[] | null;
  loadFailed: boolean;
  signOut: (session: AuthSession) => Promise<void>;
};

export function useAuthSessions(): AuthSessionsControl {
  const { userService } = useApi();
  const [sessions, setSessions] = useState<AuthSession[] | null>(null);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    userService
      .fetchSessions()
      .then((loaded) => {
        if (active) {
          setSessions(loaded);
        }
      })
      .catch(() => {
        if (active) {
          setLoadFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [userService]);

  const signOut = useCallback(
    async (session: AuthSession) => {
      try {
        await userService.revokeSession(session.id);
      } catch (reason) {
        if (!isNotFound(reason)) {
          throw reason;
        }
      }

      setSessions((current) => (current === null ? null : current.filter(({ id }) => id !== session.id)));

      await userService
        .fetchSessions()
        .then(setSessions)
        .catch(() => undefined);
    },
    [userService],
  );

  return { sessions, loadFailed, signOut };
}
