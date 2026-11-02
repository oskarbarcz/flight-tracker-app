import { twMerge } from "tailwind-merge";
import { useMapSettings } from "~/app-state/useMapSettings";

const SOURCES = [
  { label: "OpenStreetMap", href: "https://www.openstreetmap.org/copyright" },
  { label: "VersaTiles", href: "https://versatiles.org" },
  { label: "ESA WorldCover", href: "https://esa-worldcover.org/en/data-access" },
];

export const VATSPY_DATA_PROJECT = {
  label: "VATSpy Data Project",
  href: "https://github.com/vatsimnetwork/vatspy-data-project",
  license: "CC BY-SA 4.0",
};

type Props = {
  className?: string;
  withAirspace?: boolean;
};

export function MapAttribution({ className, withAirspace = false }: Props) {
  const { mapSettings } = useMapSettings();
  const showsFirs = withAirspace && mapSettings.firDisplay !== "hide";
  const sources = showsFirs
    ? [
        ...SOURCES,
        { label: `${VATSPY_DATA_PROJECT.label} (${VATSPY_DATA_PROJECT.license})`, href: VATSPY_DATA_PROJECT.href },
      ]
    : SOURCES;

  return (
    <div
      className={twMerge(
        "absolute bottom-1 right-1 z-10 rounded bg-white/80 px-1.5 py-0.5 text-2xs text-gray-500 dark:bg-gray-900/80 dark:text-gray-400",
        className,
      )}
    >
      ©{" "}
      {sources.map(({ label, href }, index) => (
        <span key={label}>
          {index > 0 && " · "}
          <a href={href} target="_blank" rel="noreferrer" className="hover:underline">
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}
