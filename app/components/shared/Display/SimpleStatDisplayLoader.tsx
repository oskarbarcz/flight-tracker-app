import React from "react";

export default function SimpleStatDisplayLoader() {
  return (
    <article className="flex items-center gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 rounded-xl animate-pulse">
      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </article>
  );
}
