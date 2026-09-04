import { useThemeMode } from "flowbite-react";
import React from "react";
import { etopsPointColor } from "~/features/route/lib/chartColors";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

type Props = {
  hasTrack: boolean;
  hasRings: boolean;
  hasPoints: boolean;
};

function Swatch({ children }: { children: React.ReactNode }) {
  return <span className="flex h-3 w-6 shrink-0 items-center">{children}</span>;
}

function Entry({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <Swatch>{swatch}</Swatch>
      {label}
    </span>
  );
}

export function ChartLegend({ hasTrack, hasRings, hasPoints }: Props) {
  const { computedMode } = useThemeMode();
  const pointColor = etopsPointColor(computedMode);

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <Entry
        label="Filed route"
        swatch={
          <svg viewBox="0 0 24 4" className="w-6" aria-hidden={true}>
            <line x1="0" y1="2" x2="24" y2="2" stroke={FLIGHT_COLOR} strokeWidth="2.5" />
          </svg>
        }
      />
      {hasTrack && (
        <Entry
          label="Oceanic track"
          swatch={
            <svg viewBox="0 0 24 4" className="w-6" aria-hidden={true}>
              <line x1="0" y1="2" x2="24" y2="2" stroke={RUNWAY_COLOR} strokeWidth="2.5" strokeDasharray="2 6" />
            </svg>
          }
        />
      )}
      {hasRings && (
        <>
          <Entry
            label="Rule ring"
            swatch={
              <svg viewBox="0 0 24 4" className="w-6" aria-hidden={true}>
                <line x1="0" y1="2" x2="24" y2="2" stroke={RUNWAY_COLOR} strokeWidth="1" />
              </svg>
            }
          />
          <Entry
            label="Threshold ring"
            swatch={
              <svg viewBox="0 0 24 4" className="w-6" aria-hidden={true}>
                <line x1="0" y1="2" x2="24" y2="2" stroke={RUNWAY_COLOR} strokeWidth="1" strokeDasharray="3 4" />
              </svg>
            }
          />
        </>
      )}
      {hasPoints && (
        <Entry
          label="Critical point filled, others hollow"
          swatch={
            <svg viewBox="0 0 24 8" className="w-6" aria-hidden={true}>
              <circle cx="7" cy="4" r="3.5" fill={pointColor} />
              <circle cx="17" cy="4" r="3.5" fill={pointColor} fillOpacity="0.4" stroke={pointColor} />
            </svg>
          }
        />
      )}
    </div>
  );
}
