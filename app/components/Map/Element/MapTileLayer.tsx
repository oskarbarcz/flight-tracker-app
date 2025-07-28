"use client";

import { TileLayer } from "react-leaflet";
import { useThemeMode } from "flowbite-react";

export default function MapTileLayer() {
  const { mode } = useThemeMode();

  const tileUrls = {
    light:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    auto: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  return <TileLayer key={mode} url={tileUrls[mode]} />;
}
