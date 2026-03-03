import React, { JSX } from "react";
import Container from "~/components/shared/Layout/Container";

type Props = {
  icon: React.ReactNode;
  color: string;
  title: string;
  value: string;
  valueSmaller?: boolean;
  valueSuffix?: string;
};

export default function RichStatDisplay({
  icon,
  color,
  title,
  value,
  valueSmaller = false,
  valueSuffix,
}: Props): JSX.Element {
  const mainColor = `text-${color}-500`;
  const backgroundColor = `bg-${color}-50`;

  const font = valueSmaller ? "text-3xl" : "text-4xl";

  return (
    <Container>
      <div className="flex gap-6 justify-between mb-6">
        <span className={`p-3 rounded-xl ${mainColor} ${backgroundColor}`}>
          {icon}
        </span>
        <span className="font-bold text-gray-500 uppercase">{title}</span>
      </div>

      <span className="text-gray-700 space-x-3 dark:text-gray-300">
        <span className={`font-bold ${font}`}>{value}</span>
        <span className="text-gray-500 text-2xl">{valueSuffix}</span>
      </span>
    </Container>
  );
}
