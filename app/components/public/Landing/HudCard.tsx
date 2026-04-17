import React from "react";

type HudCardProps = { compact?: boolean; children: React.ReactNode };

export function HudCard({ compact = false, children }: HudCardProps) {
  return (
    <div
      className={`bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl dark:shadow-2xl transition-colors duration-500 ${
        compact ? "flex-1 p-4 rounded-2xl" : "p-5 rounded-3xl"
      }`}
    >
      {children}
    </div>
  );
}
