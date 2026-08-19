import { formatDuration } from "~/shared/lib/time";

export type MetricKey = "flights" | "airborneMinutes" | "distanceNm" | "fuelBurned";

export type Metric = {
  key: MetricKey;
  label: string;
  floor: number;
  format: (value: number) => string;
  unit?: string;
};

function whole(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export const METRICS: Metric[] = [
  { key: "flights", label: "Flights", floor: 3, format: whole },
  { key: "airborneMinutes", label: "Air time", floor: 120, format: formatDuration },
  { key: "distanceNm", label: "Distance", floor: 500, format: whole, unit: "nm" },
  {
    key: "fuelBurned",
    label: "Fuel",
    floor: 20_000,
    format: (value) => (value / 1000).toFixed(1),
    unit: "t",
  },
];

export type MetricReading =
  | { available: true; current: number; previous: number | null }
  | { available: false; reason: string };
