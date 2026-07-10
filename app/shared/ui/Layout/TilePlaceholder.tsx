import React from "react";
import type { IconType } from "react-icons";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

type Props = {
  icon: IconType;
  hint: string;
};

export function TilePlaceholder({ icon: Icon, hint }: Props) {
  return (
    <ContainerEmptyState>
      <span className="flex flex-col items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <Icon size={15} aria-hidden={true} />
        </span>
        <span className="max-w-[34ch] text-sm text-gray-500 dark:text-gray-400">{hint}</span>
      </span>
    </ContainerEmptyState>
  );
}
