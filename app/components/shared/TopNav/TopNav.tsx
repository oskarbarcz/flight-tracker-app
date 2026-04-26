import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function TopNav({ children }: Props) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4 px-4 md:px-8 py-3 max-w-7xl mx-auto">{children}</div>
    </nav>
  );
}
