import React from "react";

const cardAvif = import.meta.glob("../../../assets/aircraft/*/*-600x338.avif", {
  eager: true,
  import: "default",
  query: "?url",
});
const cardWebp = import.meta.glob("../../../assets/aircraft/*/*-600x338.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const cardPng = import.meta.glob("../../../assets/aircraft/*/*-600x338.png", {
  eager: true,
  import: "default",
  query: "?url",
});

const heroAvif = import.meta.glob("../../../assets/aircraft/*/*-1200x675.avif", {
  eager: true,
  import: "default",
  query: "?url",
});
const heroWebp = import.meta.glob("../../../assets/aircraft/*/*-1200x675.webp", {
  eager: true,
  import: "default",
  query: "?url",
});
const heroPng = import.meta.glob("../../../assets/aircraft/*/*-1200x675.png", {
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

const sources = {
  card: {
    avif: indexByType(cardAvif),
    webp: indexByType(cardWebp),
    png: indexByType(cardPng),
  },
  hero: {
    avif: indexByType(heroAvif),
    webp: indexByType(heroWebp),
    png: indexByType(heroPng),
  },
};

type Props = {
  type: string;
  name?: string;
  className?: string;
  size?: "card" | "hero";
};

function merge(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function AircraftImage({ type, name, className, size = "card" }: Props) {
  const code = type.toLowerCase();
  const { avif, webp, png } = sources[size];
  const fallback = png[code];

  if (!fallback) {
    return null;
  }

  const objectFit = size === "hero" ? "object-contain" : "object-cover";

  return (
    <picture>
      {avif[code] && <source srcSet={avif[code]} type="image/avif" />}
      {webp[code] && <source srcSet={webp[code]} type="image/webp" />}
      <img src={fallback} alt={name ?? type} className={merge("w-full", objectFit, className)} />
    </picture>
  );
}
