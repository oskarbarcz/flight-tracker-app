import React from "react";

export function dateToLocalTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

type FormattedLocalTimeProps = {
  date: Date;
};

export function FormattedLocalTime({ date }: FormattedLocalTimeProps) {
  return (
    <span className="font-mono">
      {dateToLocalTime(date)}
      <span className="text-xs">LT</span>
    </span>
  );
}
