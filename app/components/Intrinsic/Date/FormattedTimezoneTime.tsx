import { twMerge } from "tailwind-merge";

export function dateToTimezoneTime(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });

  const formatted = formatter.format(date);
  return `${formatted}LT`;
}

type FormattedTimezoneTimeProps = {
  date: Date;
  timezone: string;
  className?: string;
};

export function FormattedTimezoneTime({
  date,
  timezone,
  className,
}: FormattedTimezoneTimeProps) {
  return (
    <span className={twMerge(className, "font-mono")}>
      {dateToTimezoneTime(date, timezone)}
    </span>
  );
}
