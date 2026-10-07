import React from "react";

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>;
}
