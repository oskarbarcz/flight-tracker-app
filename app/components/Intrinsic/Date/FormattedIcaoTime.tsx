import React from "react";

export function dateToIcaoTime(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

type FormattedIcaoTimeProps = {
  date: Date;
};

export function FormattedIcaoTime({ date }: FormattedIcaoTimeProps) {
  return (
    <span className="font-mono">
      {dateToIcaoTime(date)}
      <span className="text-xs ms-1">Z</span>
    </span>
  );
}
