import React from "react";

type Props = {
  name: string;
  value: string;
};

export function BadgeValueDisplay({ name, value }: Props) {
  return (
    <span className="bg-white dark:bg-gray-900 inline-block gap-1 border border-gray-200 dark:border-gray-800 rounded-full py-1.5 px-3 text-sm">
      <span className="text-gray-500">{name}:</span>
      <span className="text-black dark:text-white"> {value}</span>
    </span>
  );
}
