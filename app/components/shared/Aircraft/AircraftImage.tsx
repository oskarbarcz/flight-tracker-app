import React from "react";

const avifImages = import.meta.glob("../../../assets/aircraft/*/*-600x338.avif", {
  eager: true,
  import: "default",
  query: "?url",
});
const webpImages = import.meta.glob("../../../assets/aircraft/*/*-600x338.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const pngImages = import.meta.glob("../../../assets/aircraft/*/*-600x338.png", {
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

const avifByType = indexByType(avifImages);
const webpByType = indexByType(webpImages);
const pngByType = indexByType(pngImages);

type Props = {
  type: string;
  name?: string;
  className?: string;
};

function merge(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function AircraftImage({ type, name, className }: Props) {
  const code = type.toLowerCase();
  const png = pngByType[code];

  if (!png) {
    return null;
  }

  return (
    <picture>
      {avifByType[code] && <source srcSet={avifByType[code]} type="image/avif" />}
      {webpByType[code] && <source srcSet={webpByType[code]} type="image/webp" />}
      <img src={png} alt={name ?? type} className={merge("w-full object-cover", className)} />
    </picture>
  );
}
