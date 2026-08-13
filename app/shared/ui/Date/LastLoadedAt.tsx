import React, { useEffect, useState } from "react";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const TICK_MS = 30_000;

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

function describeElapsed(elapsedMs: number): string {
  if (elapsedMs < MINUTE_MS) return "just now";
  if (elapsedMs < HOUR_MS) return relativeTime.format(-Math.floor(elapsedMs / MINUTE_MS), "minute");
  if (elapsedMs < DAY_MS) return relativeTime.format(-Math.floor(elapsedMs / HOUR_MS), "hour");

  return relativeTime.format(-Math.floor(elapsedMs / DAY_MS), "day");
}

type Props = {
  at: string;
  label?: string;
};

export function LastLoadedAt({ at, label = "Loaded" }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), TICK_MS);

    return () => clearInterval(tick);
  }, []);

  return (
    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {label} <time dateTime={at}>{describeElapsed(now - new Date(at).getTime())}</time>
    </span>
  );
}
