import React from "react";
import { LuRefreshCw } from "react-icons/lu";
import type { AirportWeather } from "~/features/airport";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";

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
    return <PreviewEmptyState message="No weather report available for this airport." />;
  }

  return (
    <div className="space-y-4">
      {weather.watch ? (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
          <LuRefreshCw size={16} />
          <span>Weather for this airport updates automatically.</span>
        </div>
      ) : null}

      <WeatherReport label="METAR" text={weather.metar} updated={formatUpdated(weather.metarLastUpdate)} />
      <WeatherReport label="TAF" text={weather.taf} updated={formatUpdated(weather.tafLastUpdate)} />
    </div>
  );
}

function WeatherReport({ label, text, updated }: { label: string; text: string | null; updated: string | null }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">{label}</h3>
        {updated ? <span className="font-mono text-xs text-gray-500 dark:text-gray-400">Updated {updated}</span> : null}
      </header>
      <div className="px-4 py-3">
        {text ? (
          <p className="break-words font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100">{text}</p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Not available.</p>
        )}
      </div>
    </section>
  );
}
