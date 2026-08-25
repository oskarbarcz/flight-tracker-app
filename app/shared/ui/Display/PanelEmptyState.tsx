import React from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  body: string;
};

export function PanelEmptyState({ icon: Icon, title, body }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-gray-800">
      <Icon aria-hidden={true} className="size-7 text-gray-400 dark:text-gray-500" />
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
      <p className="max-w-prose text-sm text-gray-500 dark:text-gray-400">{body}</p>
    </div>
  );
}
