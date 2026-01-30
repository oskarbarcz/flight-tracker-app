import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

export default function SimpleStatDisplay({ icon, title, value }: Props) {
  return (
    <article className="flex items-center gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-4 rounded-xl">
      {icon}
      <div className="font-bold">
        <h3 className="text-gray-500 uppercase text-xs">{title}</h3>
        <span className="text-xl text-gray-700 dark:text-gray-300">
          {value}
        </span>
      </div>
    </article>
  );
}
