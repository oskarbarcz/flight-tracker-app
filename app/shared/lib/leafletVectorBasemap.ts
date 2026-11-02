import "~/shared/lib/maplibreSetup";
import maplibreGL from "@maplibre/maplibre-gl-leaflet";
import type L from "leaflet";
import type { GlobeStyle } from "~/shared/lib/globeStyle";
import { type BasemapTheme, loadBasemapStyles } from "~/shared/lib/versatilesBasemap";

export type VectorBasemap = {
  layer: L.Layer;
  setTheme: (theme: BasemapTheme) => void;
};

function flatStyle(style: GlobeStyle): GlobeStyle {
  return { ...style, projection: { type: "mercator" }, sky: { ...style.sky, "atmosphere-blend": 0 } };
}

export async function createVectorBasemap(theme: BasemapTheme): Promise<VectorBasemap> {
  const styles = await loadBasemapStyles();

  if (styles === null) {
    throw new Error("The VersaTiles basemap is unavailable");
  }

  const layer = maplibreGL({ style: flatStyle(styles[theme]) });

  layer.on("add", () => {
    const glMap = layer.getMaplibreMap();
    glMap.on("moveend", () => glMap.redraw());
  });

  return {
    layer,
    setTheme: (next) => layer.getMaplibreMap()?.setStyle(flatStyle(styles[next])),
  };
}
