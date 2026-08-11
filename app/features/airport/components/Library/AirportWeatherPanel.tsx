import React, { useState } from "react";
import { LuCloudOff } from "react-icons/lu";
import { useAuth } from "~/app-state/useAuth";
import {
  type AirportWeatherReport,
  allWeatherInformationTypes,
  WeatherInformationType,
  WeatherSource,
} from "~/features/airport";
import { WeatherSourceSwitch } from "~/features/airport/components/Library/WeatherSourceSwitch";
import { translateWeatherInformationType, translateWeatherSource } from "~/features/airport/i18n";
import { formatDate } from "~/shared/lib/time";

type Props = {
  reports: AirportWeatherReport[];
};

export function AirportWeatherPanel({ reports }: Props) {
  const { user } = useAuth();
  const [source, setSource] = useState(user?.defaultWeatherSource ?? WeatherSource.AviationWeatherGov);

  if (reports.length === 0) {
    return <NoReports>No weather report available for this airport.</NoReports>;
  }

  const visible = orderByInformationType(reports.filter((report) => report.source === source));

  return (
    <div className="space-y-3">
      <WeatherSourceSwitch selected={source} onSelect={setSource} />

      {visible.length === 0 ? (
        <NoReports>No {translateWeatherSource(source)} report available for this airport.</NoReports>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((report) => (
            <WeatherReport key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

function orderByInformationType(reports: AirportWeatherReport[]): AirportWeatherReport[] {
  const order = allWeatherInformationTypes();

  return reports.sort((left, right) => order.indexOf(left.informationType) - order.indexOf(right.informationType));
}

function NoReports({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <LuCloudOff aria-hidden className="size-4 shrink-0" />
      {children}
    </p>
  );
}

function WeatherReport({ report }: { report: AirportWeatherReport }) {
  const isSpoken = report.informationType === WeatherInformationType.Atis;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
        <h3 className="font-mono text-base font-bold text-gray-900 dark:text-white">
          {translateWeatherInformationType(report.informationType)}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated <span className="font-mono">{formatDate(new Date(report.lastFetched))} UTC</span>
        </p>
      </header>
      <p
        className={
          isSpoken
            ? "text-pretty px-3 py-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200"
            : "break-words px-3 py-2 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
        }
      >
        {report.content}
      </p>
    </section>
  );
}
