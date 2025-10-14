import { twMerge } from "tailwind-merge";
import React from "react";

export function dateToIcaoTime(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

type FormattedIcaoTimeProps = {
  date: Date;
  className?: string;
};

export function FormattedIcaoTime({ date, className }: FormattedIcaoTimeProps) {
  return (
    <span className={twMerge(className, "font-mono")}>
      {dateToIcaoTime(date)}
      <span className="text-xs">z</span>
    </span>
  );
}
