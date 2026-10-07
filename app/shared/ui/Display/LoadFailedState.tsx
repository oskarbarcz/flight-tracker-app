import { Button } from "flowbite-react";
import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

type Props = {
  title: string;
  onRetry?: () => void;
};

export function LoadFailedState({ title, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-gray-800"
    >
      <LuTriangleAlert aria-hidden={true} className="size-5 text-gray-500 dark:text-gray-400" />
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
      <p className="max-w-prose text-sm text-gray-500 dark:text-gray-400">
        {onRetry
          ? "Treat this as unknown, not as clear."
          : "Treat this as unknown, not as clear. Reload the page to try again."}
      </p>
      {onRetry && (
        <Button color="light" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
