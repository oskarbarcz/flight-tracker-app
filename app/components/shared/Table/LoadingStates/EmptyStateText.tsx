"use client";

import React from "react";

type Props = {
  title: string;
  paragraph?: string;
};

export function EmptyStateText({ title, paragraph }: Props) {
  return (
    <div className="md:w-3/4 lg:w-1/2 space-y-1.5 mx-auto mb-6 text-center dark:text-gray-200">
      <h2 className="font-bold text-lg">{title}</h2>
      {paragraph && <p className="text-gray-500">{paragraph}</p>}
    </div>
  );
}
