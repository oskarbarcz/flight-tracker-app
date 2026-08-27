import React from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  label: string;
  spin?: boolean;
};

export function ArtPlaceholder({ icon: Icon, label, spin = false }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
      <Icon className={`size-6 ${spin ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden={true} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
