import { useCallback, useEffect, useState } from "react";
import { UserStats } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type Response = {
  stats: UserStats | null;
  loading: boolean;
};

export default function useUserStats(): Response {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { userService } = useApi();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    userService
      .getUserStats()
      .then(setStats)
      .catch((err) => {
        console.error("Cannot fetch user stats", err);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, [userService]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}
