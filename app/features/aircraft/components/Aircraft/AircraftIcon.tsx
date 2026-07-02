import React from "react";

const avifIcons = import.meta.glob("../../../../assets/aircraft/*/*-icon-128x72.avif", {
  eager: true,
  import: "default",
  query: "?url",
});
const webpIcons = import.meta.glob("../../../../assets/aircraft/*/*-icon-128x72.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const pngIcons = import.meta.glob("../../../../assets/aircraft/*/*-icon-128x72.png", {
  eager: true,
  import: "default",
  query: "?url",
});

function indexByType(modules: Record<string, unknown>): Record<string, string> {
  const byType: Record<string, string> = {};
  for (const [path, url] of Object.entries(modules)) {
    const code = path.split("/").at(-2);
    if (code) byType[code] = url as string;
  }
  return byType;
}

const avifByType = indexByType(avifIcons);
const webpByType = indexByType(webpIcons);
const pngByType = indexByType(pngIcons);

type Props = {
  type: string;
  name?: string;
  className?: string;
};

function merge(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function AircraftIcon({ type, name, className }: Props) {
  const code = type.toLowerCase();
  const png = pngByType[code];

  if (!png) {
    return <div aria-hidden className={merge("w-20 h-9 rounded-md bg-gray-50 dark:bg-gray-800", className)} />;
  }

  return (
    <picture>
      {avifByType[code] && <source srcSet={avifByType[code]} type="image/avif" />}
      {webpByType[code] && <source srcSet={webpByType[code]} type="image/webp" />}
      <img src={png} alt={name ?? type} className={merge("w-20 h-9 object-cover object-center", className)} />
    </picture>
  );
}
