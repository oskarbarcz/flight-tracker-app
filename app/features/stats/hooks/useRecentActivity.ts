import { useEffect, useMemo, useState } from "react";
import { type ActivityIndex, createActivityIndex } from "~/features/stats/lib/activityIndex";
import { addUtcDays, startOfUtcDay, toIsoDate } from "~/features/stats/lib/span";
import type { ActivityDay } from "~/features/stats/model";
import { useApi } from "~/shared/api/useApi";

export type RecentActivity = {
  loading: boolean;
  failed: boolean;
  activity: ActivityIndex;
  from: Date;
  today: Date;
};

export function useRecentActivity(days: number): RecentActivity {
  const { statsService } = useApi();
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const today = useMemo(() => startOfUtcDay(new Date()), []);
  const from = useMemo(() => addUtcDays(today, -(days - 1)), [today, days]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    statsService
      .fetchActivity(toIsoDate(from), toIsoDate(today))
      .then((fetched) => {
        if (active) {
          setActivityDays(fetched);
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

  const activity = useMemo(() => createActivityIndex(activityDays), [activityDays]);

  return { loading, failed, activity, from, today };
}
