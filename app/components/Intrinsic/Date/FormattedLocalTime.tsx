import { twMerge } from "tailwind-merge";

export function dateToLocalTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}LT`;
}

type FormattedLocalTimeProps = {
  date: Date;
  className?: string;
};

export function FormattedLocalTime({
  date,
  className,
}: FormattedLocalTimeProps) {
  return (
    <span className={twMerge(className, "font-mono")}>
      {dateToLocalTime(date)}
    </span>
  );
}
