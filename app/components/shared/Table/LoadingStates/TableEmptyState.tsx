"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function TableEmptyState({ children }: Props) {
  return (
    <section className="items-center p-12 text-center text-lg font-semibold text-gray-500 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
      {children}
    </section>
  );
}
