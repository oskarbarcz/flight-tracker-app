import type { LatLngTuple } from "leaflet";
import type { GeoJSONSourceSpecification, LayerSpecification, MapOptions } from "maplibre-gl";

export type GlobeStyle = Exclude<MapOptions["style"], string | undefined>;

export type GlobeOverlay = Pick<GlobeStyle, "sources" | "layers">;

type FeatureProperties = Record<string, string | number | boolean>;

export type GlobeLine = { path: LatLngTuple[]; properties?: FeatureProperties };

export type GlobePoint = { position: LatLngTuple; properties?: FeatureProperties };

export type GlobePolygon = { ring: LatLngTuple[]; properties?: FeatureProperties };

function toLngLat([latitude, longitude]: LatLngTuple): [number, number] {
  return [longitude, latitude];
}

export function lineSource(lines: GlobeLine[]): GeoJSONSourceSpecification {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: lines
        .filter(({ path }) => path.length > 1)
        .map(({ path, properties = {} }) => ({
          type: "Feature",
          properties,
          geometry: { type: "LineString", coordinates: path.map(toLngLat) },
        })),
    },
  };
}

export function polygonSource(polygons: GlobePolygon[]): GeoJSONSourceSpecification {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: polygons
        .filter(({ ring }) => ring.length > 2)
        .map(({ ring, properties = {} }) => ({
          type: "Feature",
          properties,
          geometry: { type: "Polygon", coordinates: [[...ring, ring[0]].map(toLngLat)] },
        })),
    },
  };
}

export function pointSource(points: GlobePoint[]): GeoJSONSourceSpecification {
  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: points.map(({ position, properties = {} }) => ({
        type: "Feature",
        properties,
        geometry: { type: "Point", coordinates: toLngLat(position) },
      })),
    },
  };
}

export function mergeOverlays(...overlays: GlobeOverlay[]): GlobeOverlay {
  return {
    sources: Object.assign({}, ...overlays.map((overlay) => overlay.sources)),
    layers: overlays.flatMap((overlay) => overlay.layers),
  };
}

export type BasemapOptions = {
  labels?: boolean;
};

function withoutLabels(layer: LayerSpecification): LayerSpecification {
  return layer.type === "symbol" ? { ...layer, layout: { ...layer.layout, visibility: "none" } } : layer;
}

export function composeGlobeStyle(
  basemap: GlobeStyle,
  overlay: GlobeOverlay,
  { labels = true }: BasemapOptions = {},
): GlobeStyle {
  const hasGlyphs = basemap.glyphs !== undefined;

  return {
    ...basemap,
    projection: { type: "globe" },
    sky: { ...basemap.sky, "atmosphere-blend": 0 },
    sources: { ...basemap.sources, ...overlay.sources },
    layers: [
      ...(labels ? basemap.layers : basemap.layers.map(withoutLabels)),
      ...overlay.layers.filter((layer) => hasGlyphs || layer.type !== "symbol"),
    ],
  };
}
