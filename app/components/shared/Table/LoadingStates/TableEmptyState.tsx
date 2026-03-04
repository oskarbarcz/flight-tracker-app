"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export function TableEmptyState({ children }: Props) {
  return (
    <section className="p-6 md:p-9 lg:p-12 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
      {children}
    </section>
  );
}
