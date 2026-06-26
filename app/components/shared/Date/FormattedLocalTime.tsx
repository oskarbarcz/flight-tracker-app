import React from "react";
import { padZero } from "~/functions/time";

export function dateToLocalTime(date: Date, seconds: boolean): string {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  if (!seconds) {
    return `${hours}:${minutes}`;
  }

  const secs = padZero(date.getSeconds());
  return `${hours}:${minutes}:${secs}`;
}

type FormattedLocalTimeProps = {
  date: Date;
  seconds?: boolean;
};

export function FormattedLocalTime({ date, seconds = false }: FormattedLocalTimeProps) {
  return (
    <span className="font-mono">
      {dateToLocalTime(date, seconds)}
      <span className="text-xs">LT</span>
    </span>
  );
}
