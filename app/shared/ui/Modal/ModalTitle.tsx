import React from "react";

type Props = {
  context: string;
  action: string;
};

export function ModalTitle({ context, action }: Props) {
  return (
    <span className="flex min-w-0 items-baseline gap-2">
      <span className="shrink-0 font-normal text-gray-600 dark:text-gray-400">{context}</span>
      <span aria-hidden={true} className="shrink-0 font-normal text-gray-400 dark:text-gray-500">
        /
      </span>
      <span className="truncate font-semibold text-gray-900 dark:text-white">{action}</span>
    </span>
  );
}
