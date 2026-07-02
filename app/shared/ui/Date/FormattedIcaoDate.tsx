import { MONTHS_SHORT_UPPER } from "~/shared/lib/date";
import { padZero } from "~/shared/lib/time";

export function dateToIcaoDate(date: Date): string {
  const day = padZero(date.getUTCDate());
  const month = MONTHS_SHORT_UPPER[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();

  const yearPart = year === currentYear ? "" : ` ${year}`;
  return `${day}${month}${yearPart}`;
}

type FormattedIcaoDateProps = {
  date: Date;
};

export function FormattedIcaoDate({ date }: FormattedIcaoDateProps) {
  return <span className="font-mono">{dateToIcaoDate(date)}</span>;
}
