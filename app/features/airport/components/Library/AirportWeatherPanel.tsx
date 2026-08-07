import React from "react";
import { LuCloudOff, LuRefreshCw } from "react-icons/lu";
import type { AirportWeather } from "~/features/airport";

type Props = {
  weather: AirportWeather;
};

function formatUpdated(iso: string | null): string | null {
  if (!iso) {
    return null;
  }
  return `${iso.slice(0, 16).replace("T", " ")} UTC`;
}

export function AirportWeatherPanel({ weather }: Props) {
  if (!weather.metar && !weather.taf) {
    return (
      <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <LuCloudOff aria-hidden className="size-4 shrink-0" />
        No weather report available for this airport.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {weather.watch ? (
        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <LuRefreshCw aria-hidden className="size-3.5 shrink-0" />
          Updates automatically
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeatherReport label="METAR" text={weather.metar} updated={formatUpdated(weather.metarLastUpdate)} />
        <WeatherReport label="TAF" text={weather.taf} updated={formatUpdated(weather.tafLastUpdate)} />
      </div>
    </div>
  );
}

function WeatherReport({ label, text, updated }: { label: string; text: string | null; updated: string | null }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
        <h3 className="font-mono text-base font-bold text-gray-900 dark:text-white">{label}</h3>
        {updated ? (
          <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
            Updated <span className="font-mono">{updated}</span>
          </span>
        ) : null}
      </header>
      <p
        className={
          text
            ? "break-words px-3 py-2 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
            : "px-3 py-2 text-sm text-gray-400 dark:text-gray-600"
        }
      >
        {text ?? "Not available"}
      </p>
    </section>
  );
}
