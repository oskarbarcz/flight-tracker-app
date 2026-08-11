import { getUtcOffset } from "~/shared/lib/formatGeo";

type TimezoneOption = { value: string; label: string };

const unselected: TimezoneOption = { value: "", label: "Select timezone…" };

let supported: TimezoneOption[] | null = null;

function timezoneOption(timezone: string): TimezoneOption {
  const offset = getUtcOffset(timezone);
  return { value: timezone, label: offset === "" ? timezone : `${timezone} (${offset})` };
}

function utcOffsetMinutes(timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "longOffset" }).formatToParts(
    new Date(),
  );
  const offset = /^GMT([+-])(\d{2}):(\d{2})$/.exec(parts.find((part) => part.type === "timeZoneName")?.value ?? "");

  if (!offset) {
    return 0;
  }

  return (offset[1] === "-" ? -1 : 1) * (Number(offset[2]) * 60 + Number(offset[3]));
}

function supportedTimezones(): TimezoneOption[] {
  supported ??= Intl.supportedValuesOf("timeZone")
    .map((timezone) => ({ timezone, minutes: utcOffsetMinutes(timezone) }))
    .sort((a, b) => a.minutes - b.minutes || a.timezone.localeCompare(b.timezone))
    .map(({ timezone }) => timezoneOption(timezone));
  return supported;
}

export function timezoneOptions(selected: string): TimezoneOption[] {
  const options = supportedTimezones();

  if (!selected) {
    return [unselected, ...options];
  }

  return options.some((option) => option.value === selected) ? options : [timezoneOption(selected), ...options];
}
