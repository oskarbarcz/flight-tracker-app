import { useCallback, useEffect, useState } from "react";
import { dateDiffToProgress } from "~/shared/lib/time";

export function useDateProgress(a: Date, b: Date): number {
  const [now, setNow] = useState(new Date());

  const updateNow = useCallback(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    updateNow();

    const interval = setInterval(updateNow, 60000);

    return () => clearInterval(interval);
  }, [updateNow]);

  return dateDiffToProgress(a, b, now);
}
