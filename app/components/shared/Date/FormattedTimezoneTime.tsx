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

function getTimezoneAbbreviation(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const timeZonePart = parts.find((part) => part.type === "timeZoneName");

  return timeZonePart?.value || "";
}

function getTimezoneOffset(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  });

  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  return offsetPart?.value || "";
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
      <span className="text-xs">
        {getTimezoneOffset(date, timezone)}|
        {getTimezoneAbbreviation(date, timezone)}
      </span>
    </span>
  );
}
