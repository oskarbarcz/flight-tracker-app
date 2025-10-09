import { twMerge } from "tailwind-merge";

export function dateToIcaoDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();

  const yearPart = year === currentYear ? "" : ` ${year}`;
  return `${day} ${month}${yearPart}`;
}

type FormattedIcaoDateProps = {
  date: Date;
  className?: string;
};

export function FormattedIcaoDate({ date, className }: FormattedIcaoDateProps) {
  return (
    <span className={twMerge(className, "font-mono")}>
      {dateToIcaoDate(date)}
    </span>
  );
}
