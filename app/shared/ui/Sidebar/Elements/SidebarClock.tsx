import { useEffect, useState } from "react";
import { MONTHS_SHORT_UPPER } from "~/shared/lib/date";
import { padZero } from "~/shared/lib/time";

export function SidebarClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = `${padZero(now.getUTCDate())} ${MONTHS_SHORT_UPPER[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
  const time = `${padZero(now.getUTCHours())}:${padZero(now.getUTCMinutes())}:${padZero(now.getUTCSeconds())}`;

  return (
    <div className="flex flex-col items-center font-mono leading-none tabular-nums">
      <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
      <span className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
        {time}
        <span className="ms-0.5 text-sm font-semibold text-gray-400 dark:text-gray-500">Z</span>
      </span>
    </div>
  );
}
