import React, { useEffect, useMemo, useRef, useState } from "react";
import { HeatmapTooltip } from "~/features/stats/components/Heatmap/HeatmapTooltip";
import { HEAT_LEVELS } from "~/features/stats/components/Heatmap/levels";
import { tileClasses } from "~/features/stats/components/Heatmap/tile";
import type { Heatmap, HeatmapDay } from "~/features/stats/lib/heatmap";
import { toIsoDate } from "~/features/stats/lib/span";

type Props = {
  heatmap: Heatmap;
  today: Date;
};

type Hover = {
  day: HeatmapDay;
  centre: number;
  y: number;
  frameWidth: number;
};

const WEEKDAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "" },
  { id: "sun", label: "Sun" },
];

const OPEN_DELAY_MS = 180;

export function ActivityHeatmap({ heatmap, today }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | null>(null);
  const [outlined, setOutlined] = useState<Hover | null>(null);
  const [popup, setPopup] = useState<Hover | null>(null);

  const todayKey = toIsoDate(today);

  const daysByKey = useMemo(() => {
    const index = new Map<string, HeatmapDay>();
    for (const column of heatmap.columns) {
      for (const day of column.days) {
        index.set(day.key, day);
      }
    }
    return index;
  }, [heatmap]);

  useEffect(() => {
    return () => {
      if (openTimer.current !== null) {
        window.clearTimeout(openTimer.current);
      }
    };
  }, []);

  function locate(day: HeatmapDay, cell: HTMLElement): Hover | null {
    const frame = frameRef.current;
    if (frame === null) {
      return null;
    }

    const frameRect = frame.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();

    return {
      day,
      centre: cellRect.left + cellRect.width / 2 - frameRect.left,
      y: cellRect.top - frameRect.top,
      frameWidth: frameRect.width,
    };
  }

  function trackPointer(event: React.PointerEvent<HTMLDivElement>) {
    const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-day]");
    if (cell === null) {
      return;
    }

    const key = cell.dataset.day ?? "";
    if (key === outlined?.day.key) {
      return;
    }

    const day = daysByKey.get(key);
    if (day === undefined) {
      return;
    }

    const next = locate(day, cell);
    if (next === null) {
      return;
    }

    setOutlined(next);
    setPopup(null);

    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
    }
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      setPopup(next);
    }, OPEN_DELAY_MS);
  }

  function clearPointer() {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    setOutlined(null);
    setPopup(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div ref={frameRef} className="relative">
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[680px] flex-col gap-1">
            <div className="flex gap-[3px] ps-7">
              {heatmap.columns.map((column) => (
                <span
                  key={column.key}
                  className="min-w-0 flex-1 font-mono text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500"
                >
                  {column.monthLabel}
                </span>
              ))}
            </div>

            <div className="flex gap-[3px]" onPointerOver={trackPointer} onPointerLeave={clearPointer}>
              <div className="flex w-6 shrink-0 flex-col justify-between text-end">
                {WEEKDAYS.map((weekday) => (
                  <span key={weekday.id} className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                    {weekday.label}
                  </span>
                ))}
              </div>

              {heatmap.columns.map((column) => (
                <div key={column.key} className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  {column.days.map((day) =>
                    day.inRange ? (
                      <span
                        key={day.key}
                        data-day={day.key}
                        className={tileClasses(day, {
                          size: "aspect-square w-full",
                          isToday: day.key === todayKey,
                          isHovered: outlined?.day.key === day.key,
                        })}
                      />
                    ) : (
                      <span key={day.key} className="aspect-square w-full" aria-hidden={true} />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {popup !== null && (
          <HeatmapTooltip day={popup.day} centre={popup.centre} y={popup.y} frameWidth={popup.frameWidth} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="font-mono tabular-nums">0h</span>
          {HEAT_LEVELS.map((level) => (
            <span
              key={level.id}
              aria-hidden={true}
              className={`size-[11px] rounded border border-gray-900/10 dark:border-white/10 ${level.fill}`}
            />
          ))}
          <span className="font-mono tabular-nums">9h+</span>
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          Shaded by block time on the day. Hover a square for the exact figures.
        </span>
      </div>
    </div>
  );
}
