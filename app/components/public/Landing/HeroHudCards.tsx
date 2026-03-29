import React from "react";
import { FaPlane } from "react-icons/fa6";

// ─── Speed Card ────────────────────────────────────────────────────────────────

export function SpeedHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 transition-colors duration-500 ${
        compact ? "flex-1 p-4 rounded-2xl shadow-xl dark:shadow-2xl" : "p-5 rounded-3xl shadow-xl dark:shadow-2xl"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Speed</span>
        <span className="text-[10px] text-green-600 dark:text-green-400 font-mono bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-400/20">
          LIVE
        </span>
      </div>
      <p className={`font-mono text-gray-900 dark:text-white tracking-tight ${compact ? "text-3xl" : "text-4xl"}`}>M .78</p>
      <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 mt-3 rounded-full overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-[78%] h-full" />
      </div>
    </div>
  );
}

// ─── Altitude Card ─────────────────────────────────────────────────────────────

export function AltitudeHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 transition-colors duration-500 ${
        compact ? "flex-1 p-4 rounded-2xl shadow-xl dark:shadow-2xl" : "p-5 rounded-3xl shadow-xl dark:shadow-2xl"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Altitude</span>
        <span className="text-indigo-600 dark:text-indigo-400">
          <FaPlane size={compact ? 14 : 16} className="-rotate-45" />
        </span>
      </div>
      <p className={`font-mono text-gray-900 dark:text-white tracking-tight ${compact ? "text-3xl" : "text-4xl"}`}>FL360</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
        <p className="text-sm text-green-600 dark:text-green-400 font-mono">+1,200 fpm</p>
      </div>
    </div>
  );
}

// ─── Weight Card ───────────────────────────────────────────────────────────────

export function WeightHudCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 transition-colors duration-500 ${
        compact ? "flex-1 p-4 rounded-2xl shadow-xl dark:shadow-2xl" : "p-5 rounded-3xl shadow-xl dark:shadow-2xl"
      }`}
    >
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
    </div>
  );
}
