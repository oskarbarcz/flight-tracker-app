import React from "react";
import { twMerge } from "tailwind-merge";

const flags = import.meta.glob("../../../assets/flags/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
});

const byCode: Record<string, string> = Object.fromEntries(
  Object.entries(flags).map(([path, url]) => [path.split("/").at(-1)?.replace(".svg", "") ?? "", url as string]),
);

type Props = {
  code: string;
  name: string;
  className?: string;
};

export function CountryFlag({ code, name, className }: Props) {
  const source = byCode[code.toLowerCase()];

  if (!source) {
    return null;
  }

  return (
    <img
      src={source}
      alt={`Flag of ${name}`}
      loading="lazy"
      decoding="async"
      className={twMerge(
        "h-3.5 w-[1.167rem] shrink-0 rounded-[2px] object-cover ring-1 ring-gray-900/15 dark:ring-white/20",
        className,
      )}
    />
  );
}
