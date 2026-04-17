import React from "react";
import { HudCard } from "./HudCard";

export function WeightHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <HudCard compact={compact}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
          {compact ? "Weight" : "Weight Data"}
        </span>
        <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono bg-indigo-100 dark:bg-indigo-400/20 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-400/20">
          SYNCED
        </span>
      </div>
      <div className={`grid grid-cols-2 ${compact ? "gap-3 mt-1" : "gap-4 mt-2"}`}>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-0.5">ZFW</p>
          <p className={`font-mono text-gray-900 dark:text-white ${compact ? "text-xl" : "text-2xl"}`}>64.2T</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-0.5">BLOCK</p>
          <p className={`font-mono text-gray-900 dark:text-white ${compact ? "text-xl" : "text-2xl"}`}>72.4T</p>
        </div>
      </div>
    </HudCard>
  );
}
