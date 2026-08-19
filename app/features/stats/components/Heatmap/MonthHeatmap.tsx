import React from "react";
import { tileClasses } from "~/features/stats/components/Heatmap/tile";
import { describeDay, type Heatmap } from "~/features/stats/lib/heatmap";
import { toIsoDate } from "~/features/stats/lib/span";

type Props = {
  heatmap: Heatmap;
  today: Date;
};

export function MonthHeatmap({ heatmap, today }: Props) {
  const todayKey = toIsoDate(today);

  return (
    <div className="flex w-fit shrink-0 gap-[2px]">
      {heatmap.columns.map((column) => (
        <div key={column.key} className="flex flex-col gap-[2px]">
          {column.days.map((day) =>
            day.inRange ? (
              <span
                key={day.key}
                title={day.isFuture ? undefined : describeDay(day)}
                className={tileClasses(day, { size: "size-3", isToday: day.key === todayKey })}
              />
            ) : (
              <span key={day.key} className="size-3" aria-hidden={true} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}
