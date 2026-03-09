import React from "react";
import type { IconType } from "react-icons";
import { Container } from "~/components/shared/Layout/Container";

type Props = {
  icon: IconType;
  color: "blue" | "green" | "orange" | "indigo";
  title: string;
  value: string;
  valueSmaller?: boolean;
  valueSuffix?: string;
};

export function RichStatDisplay({ icon: Icon, color, title, value, valueSmaller = false, valueSuffix }: Props) {
  const font = valueSmaller ? "text-3xl" : "text-4xl";

  const colorMap = {
    blue: { text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
    orange: { text: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950" },
    indigo: { text: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950" },
    green: { text: "text-green-500", bg: "bg-green-100 dark:bg-green-950" },
  };

  const { text, bg } = colorMap[color];

  return (
    <Container>
      <div className="flex gap-6 justify-between mb-6">
        <div className={`${text} ${bg} size-10 shrink-0 flex items-center justify-center rounded-xl`}>
          <Icon className="size-4" />
        </div>
        <span className="font-bold text-gray-500 uppercase">{title}</span>
      </div>

      <span className="text-gray-700 space-x-3 dark:text-gray-300">
        <span className={`font-bold ${font}`}>{value}</span>
        <span className="text-gray-500 text-2xl">{valueSuffix}</span>
      </span>
    </Container>
  );
}
