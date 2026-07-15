import { useEffect, useState } from "react";
import { secondsToNow } from "~/shared/lib/time";

export function useCountdown(targetTime: Date): number {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => secondsToNow(targetTime));

  useEffect(() => {
    setSecondsLeft(secondsToNow(targetTime));
    const interval = setInterval(() => setSecondsLeft(secondsToNow(targetTime)), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return secondsLeft;
}
