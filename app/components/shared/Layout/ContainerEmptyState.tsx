"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export function ContainerEmptyState({ children }: Props) {
  return (
    <div className="mt-3 flex items-center justify-center p-8 text-center text-gray-500 bg-gray-200/70 dark:bg-gray-800/60 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      {children}
    </div>
  );
}
