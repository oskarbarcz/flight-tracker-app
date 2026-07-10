import React from "react";

type Props = {
  message: string;
};

export function PreviewEmptyState({ message }: Props) {
  return (
    <div className="rounded-xl bg-gray-50 px-6 py-10 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
      {message}
    </div>
  );
}
