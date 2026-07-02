import React from "react";

type Props = {
  children: React.ReactNode;
};

export function EmergencyEmptyState({ children }: Props) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
      {children}
    </div>
  );
}
