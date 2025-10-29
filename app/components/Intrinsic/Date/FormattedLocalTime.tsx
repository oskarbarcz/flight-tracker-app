import React from "react";

export function dateToLocalTime(date: Date, seconds: boolean): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (!seconds) {
    return `${hours}:${minutes}`;
  }

  const secs = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

type FormattedLocalTimeProps = {
  date: Date;
  seconds?: boolean;
};

export function FormattedLocalTime({
  date,
  seconds = false,
}: FormattedLocalTimeProps) {
  return (
    <span className="font-mono">
      {dateToLocalTime(date, seconds)}
      <span className="text-xs ms-1">LT</span>
    </span>
  );
}
