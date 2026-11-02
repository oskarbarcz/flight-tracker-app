import { twMerge } from "tailwind-merge";

const SOURCES = [
  { label: "OpenStreetMap", href: "https://www.openstreetmap.org/copyright" },
  { label: "VersaTiles", href: "https://versatiles.org" },
  { label: "ESA WorldCover", href: "https://esa-worldcover.org/en/data-access" },
];

type Props = {
  className?: string;
};

export function MapAttribution({ className }: Props) {
  return (
    <div
      className={twMerge(
        "absolute bottom-1 right-1 z-10 rounded bg-white/80 px-1.5 py-0.5 text-2xs text-gray-500 dark:bg-gray-900/80 dark:text-gray-400",
        className,
      )}
    >
      ©{" "}
      {SOURCES.map(({ label, href }, index) => (
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
