import { useThemeMode } from "flowbite-react";
import React, { useEffect, useState } from "react";

const heroImages = {
  light: {
    id: "photo-1436491865332-7a61a109cc05",
    alt: "Gray and white airplane in flight near clear blue sky",
    backdrop: "bg-blue-50/50",
    treatment: "opacity-35 brightness-110 saturate-[0.85]",
  },
  dark: {
    id: "photo-1587408811730-1a978e6c407d",
    alt: "Airliner cockpit at dusk",
    backdrop: "bg-black",
    treatment: "opacity-50 brightness-[0.6] contrast-125",
  },
};

const CANDIDATE_WIDTHS = [640, 828, 1280, 1920, 2560];

function heroUrl(id: string, width: number): string {
  return `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;
}

export function HeroBackground() {
  const { computedMode } = useThemeMode();
  const [, refreshOnSystemThemeChange] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => refreshOnSystemThemeChange((tick) => tick + 1);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const hero = heroImages[computedMode === "dark" ? "dark" : "light"];

  return (
    <>
      <div className={`absolute inset-0 w-full h-full ${hero.backdrop} transition-opacity duration-1000`}>
        <img
          src={heroUrl(hero.id, 1280)}
          srcSet={CANDIDATE_WIDTHS.map((width) => `${heroUrl(hero.id, width)} ${width}w`).join(", ")}
          sizes="100vw"
          fetchPriority="high"
          decoding="async"
          alt={hero.alt}
          className={`absolute inset-0 w-full h-full object-cover object-center ${hero.treatment}`}
        />
      </div>

      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-gray-50 dark:from-[#0c0c0e] via-gray-50/90 dark:via-[#0c0c0e]/90 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-white dark:from-gray-950 via-white/60 dark:via-gray-950/60 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-y-0 right-0 w-48 bg-linear-to-l from-white dark:from-gray-950 via-white/60 dark:via-gray-950/60 to-transparent z-0 pointer-events-none transition-colors duration-500" />
    </>
  );
}
