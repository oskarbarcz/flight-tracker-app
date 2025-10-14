import React from "react";

export function dateToTimezoneTime(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  return formatter.format(date);
}

type FormattedTimezoneTimeProps = {
  date: Date;
  timezone: string;
};

export function FormattedTimezoneTime({
  date,
  timezone,
}: FormattedTimezoneTimeProps) {
  return (
    <span className="font-mono">
      {dateToTimezoneTime(date, timezone)}
      <span className="text-xs">LT</span>
    </span>
  );
}
