import React from "react";
import { HudCard } from "./HudCard";

export function SpeedHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <HudCard compact={compact}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Speed</span>
        <span className="text-[10px] text-green-600 dark:text-green-400 font-mono bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-400/20">
          LIVE
        </span>
      </div>
      <p className={`font-mono text-gray-900 dark:text-white tracking-tight ${compact ? "text-3xl" : "text-4xl"}`}>
        M .78
      </p>
      <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 mt-3 rounded-full overflow-hidden">
        <div className="bg-linear-to-r from-indigo-500 to-purple-500 w-[78%] h-full" />
      </div>
    </HudCard>
  );
}
