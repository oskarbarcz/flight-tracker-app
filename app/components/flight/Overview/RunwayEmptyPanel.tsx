"use client";

import React from "react";
import { LuArrowDownToLine } from "react-icons/lu";

export function RunwayEmptyPanel() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/40 dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex items-center gap-2 border-b border-dashed border-gray-300/70 px-3 py-2 dark:border-gray-700/70">
        <LuArrowDownToLine className="rotate-180 text-gray-400" size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Runway</span>
        <span className="ms-auto text-[10px] font-bold uppercase tracking-wider text-gray-400">Not assigned</span>
      </div>
      <p className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">No runway has been assigned to this flight.</p>
    </div>
  );
}
