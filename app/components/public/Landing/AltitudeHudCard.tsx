import React from "react";
import { FaPlane } from "react-icons/fa6";
import { HudCard } from "./HudCard";

export function AltitudeHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <HudCard compact={compact}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Altitude</span>
        <span className="text-indigo-600 dark:text-indigo-400">
          <FaPlane size={compact ? 14 : 16} className="-rotate-45" />
        </span>
      </div>
      <p className={`font-mono text-gray-900 dark:text-white tracking-tight ${compact ? "text-3xl" : "text-4xl"}`}>
        FL360
      </p>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
        <p className="text-sm text-green-600 dark:text-green-400 font-mono">+1,200 fpm</p>
      </div>
    </HudCard>
  );
}
