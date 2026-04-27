import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function TopNav({ children }: Props) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-center px-4 md:px-8">
        <div className="flex w-full max-w-7xl items-center justify-between gap-4 py-3">{children}</div>
      </div>
    </nav>
  );
}
