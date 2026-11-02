import "~/shared/lib/maplibreSetup";
import maplibreGL from "@maplibre/maplibre-gl-leaflet";
import type L from "leaflet";
import { composeGlobeStyle, type GlobeOverlay, type GlobeStyle } from "~/shared/lib/globeStyle";
import { type BasemapStyles, type BasemapTheme, loadBasemapStyles } from "~/shared/lib/versatilesBasemap";

export type BasemapLook = {
  theme: BasemapTheme;
  overlay: GlobeOverlay;
  labels: boolean;
};

export type VectorBasemap = {
  layer: L.Layer;
  setLook: (look: BasemapLook) => void;
};

function flatStyle(styles: BasemapStyles, { theme, overlay, labels }: BasemapLook): GlobeStyle {
  return { ...composeGlobeStyle(styles[theme], overlay, { labels }), projection: { type: "mercator" } };
}

export async function createVectorBasemap(look: BasemapLook): Promise<VectorBasemap> {
  const styles = await loadBasemapStyles();

  if (styles === null) {
    throw new Error("The VersaTiles basemap is unavailable");
  }

  const layer = maplibreGL({ style: flatStyle(styles, look) });

  layer.on("add", () => {
    const glMap = layer.getMaplibreMap();
    glMap.on("moveend", () => glMap.redraw());
  });

  return {
    layer,
    setLook: (next) => layer.getMaplibreMap()?.setStyle(flatStyle(styles, next)),
  };
}
