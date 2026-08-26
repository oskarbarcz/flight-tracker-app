import { useThemeMode } from "flowbite-react";
import { useEffect, useState } from "react";
import { TileLayer } from "react-leaflet";
import { getCartoApiKey } from "~/shared/lib/getCartoApiKey";

const cartoApiKey = getCartoApiKey();
const apiKeyQuery = cartoApiKey === null ? "" : `?key=${encodeURIComponent(cartoApiKey)}`;

const tileUrls = {
  light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${apiKeyQuery}`,
  dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${apiKeyQuery}`,
};

export function MapTileLayer() {
  const { computedMode } = useThemeMode();
  const [, refreshOnSystemThemeChange] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => refreshOnSystemThemeChange((tick) => tick + 1);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const theme = computedMode === "dark" ? "dark" : "light";

  return <TileLayer key={theme} url={tileUrls[theme]} maxZoom={20} />;
}
