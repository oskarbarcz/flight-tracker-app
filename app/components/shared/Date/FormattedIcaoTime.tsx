import React from "react";
import { padZero } from "~/functions/time";

export function dateToIcaoTime(date: Date): string {
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());

  return `${hours}:${minutes}`;
}

type FormattedIcaoTimeProps = {
  date: Date;
};

export function FormattedIcaoTime({ date }: FormattedIcaoTimeProps) {
  return (
    <span className="font-mono">
      {dateToIcaoTime(date)}
      <span className="text-xs">Z</span>
    </span>
  );
}
