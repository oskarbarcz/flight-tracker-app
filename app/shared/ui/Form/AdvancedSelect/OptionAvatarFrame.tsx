import React from "react";

export function OptionAvatarFrame({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 p-1 dark:bg-gray-700">
      {children}
    </span>
  );
}
