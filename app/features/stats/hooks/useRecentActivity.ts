import { useEffect, useMemo, useState } from "react";
import { type ActivityIndex, createActivityIndex } from "~/features/stats/lib/activityIndex";
import { addUtcDays, startOfUtcDay, startOfUtcWeek, toIsoDate } from "~/features/stats/lib/span";
import type { ActivityDay } from "~/features/stats/model";
import { useApi } from "~/shared/api/useApi";

export type RecentActivity = {
  loading: boolean;
  failed: boolean;
  activity: ActivityIndex;
  from: Date;
  to: Date;
  today: Date;
};

export function useRecentActivity(weeks: number): RecentActivity {
  const { statsService } = useApi();
  const [days, setDays] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const today = useMemo(() => startOfUtcDay(new Date()), []);
  const from = useMemo(() => addUtcDays(startOfUtcWeek(today), -7 * (weeks - 1)), [today, weeks]);
  const to = useMemo(() => addUtcDays(startOfUtcWeek(today), 6), [today]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    statsService
      .fetchActivity(toIsoDate(from), toIsoDate(today))
      .then((fetched) => {
        if (active) {
          setDays(fetched);
          setFailed(false);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [statsService, from, today]);

  const activity = useMemo(() => createActivityIndex(days), [days]);

  return { loading, failed, activity, from, to, today };
}
