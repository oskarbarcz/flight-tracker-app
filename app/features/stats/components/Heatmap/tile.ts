import { twMerge } from "tailwind-merge";
import { HEAT_LEVELS } from "~/features/stats/components/Heatmap/levels";
import type { HeatmapDay } from "~/features/stats/lib/heatmap";

type Options = {
  size: string;
  isToday: boolean;
  isHovered?: boolean;
};

export function tileClasses(day: HeatmapDay, { size, isToday, isHovered }: Options): string {
  const outline = isToday ? "ring-red-500 dark:ring-red-400" : "ring-gray-900 dark:ring-white";

  return twMerge(
    size,
    "rounded border transition-[box-shadow,transform] duration-[90ms] ease-out motion-reduce:transition-none",
    day.isFuture
      ? "border-gray-300 dark:border-gray-600"
      : twMerge("border-gray-900/10 dark:border-white/10", HEAT_LEVELS[day.level].fill),
    isToday && twMerge("ring-1", outline),
    isHovered && twMerge("relative z-10 scale-110 ring-2", outline),
  );
}
