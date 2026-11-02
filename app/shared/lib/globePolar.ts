import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import type { LatLngTuple } from "leaflet";
import type { LayerSpecification, SourceSpecification } from "maplibre-gl";
import type { GlobeOverlay } from "~/shared/lib/globeStyle";

export const MERCATOR_LIMIT = 85.051129;

type Properties = Record<string, unknown>;

export type ScreenLine = {
  kind: "line";
  id: string;
  layer: string;
  path: LatLngTuple[];
  color: string;
  width: number;
  opacity: number;
  dash: string | null;
  cap: string;
  join: string;
};

export type ScreenPoint = {
  kind: "point";
  id: string;
  layer: string;
  position: LatLngTuple;
  properties: Properties;
  radius: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
};

export type ScreenShape = ScreenLine | ScreenPoint;

export type PolarSeparation = {
  overlay: GlobeOverlay;
  shapes: ScreenShape[];
};

type PolarLine = { path: LatLngTuple[]; properties: Properties };
type PolarPoint = { position: LatLngTuple; properties: Properties };
type PolarParts = { lines: PolarLine[]; points: PolarPoint[] };

function isPolar([latitude]: LatLngTuple): boolean {
  return Math.abs(latitude) > MERCATOR_LIMIT;
}

function toLatLng([longitude, latitude]: Position): LatLngTuple {
  return [latitude, longitude];
}

function toPosition([latitude, longitude]: LatLngTuple): Position {
  return [longitude, latitude];
}

function crossing(from: LatLngTuple, to: LatLngTuple): LatLngTuple {
  const polarLatitude = isPolar(from) ? from[0] : to[0];
  const boundary = Math.sign(polarLatitude) * MERCATOR_LIMIT;
  const span = to[1] - from[1];
  const toLongitude = span > 180 ? to[1] - 360 : span < -180 ? to[1] + 360 : to[1];
  const fraction = (boundary - from[0]) / (to[0] - from[0]);

  return [boundary, from[1] + fraction * (toLongitude - from[1])];
}

export function splitAtMercatorLimit(path: LatLngTuple[]): { tiled: LatLngTuple[][]; polar: LatLngTuple[][] } {
  const tiled: LatLngTuple[][] = [];
  const polar: LatLngTuple[][] = [];
  const close = (run: LatLngTuple[], runIsPolar: boolean) => {
    if (run.length > 1) (runIsPolar ? polar : tiled).push(run);
  };

  if (path.length === 0) {
    return { tiled, polar };
  }

  let run: LatLngTuple[] = [path[0]];
  let runIsPolar = isPolar(path[0]);

  for (const [index, point] of path.slice(1).entries()) {
    if (isPolar(point) === runIsPolar) {
      run.push(point);
      continue;
    }

    const edge = crossing(path[index], point);
    run.push(edge);
    close(run, runIsPolar);
    run = [edge, point];
    runIsPolar = !runIsPolar;
  }

  close(run, runIsPolar);

  return { tiled, polar };
}

function isFeatureCollection(data: unknown): data is FeatureCollection {
  return typeof data === "object" && data !== null && (data as FeatureCollection).type === "FeatureCollection";
}

function lineFeature(path: LatLngTuple[], properties: Feature["properties"]): Feature {
  return { type: "Feature", properties, geometry: { type: "LineString", coordinates: path.map(toPosition) } };
}

function separateFeature(feature: Feature<Geometry>, parts: PolarParts): Feature[] {
  const { geometry } = feature;
  const properties = feature.properties ?? {};
  const lines =
    geometry.type === "LineString"
      ? [geometry.coordinates]
      : geometry.type === "MultiLineString"
        ? geometry.coordinates
        : null;

  if (lines !== null) {
    return lines.flatMap((coordinates) => {
      const { tiled, polar } = splitAtMercatorLimit(coordinates.map(toLatLng));
      parts.lines.push(...polar.map((path) => ({ path, properties })));
      return tiled.map((path) => lineFeature(path, feature.properties));
    });
  }

  if (geometry.type === "Point" && isPolar(toLatLng(geometry.coordinates))) {
    parts.points.push({ position: toLatLng(geometry.coordinates), properties });
    return [];
  }

  return [feature];
}

function separateSource(source: SourceSpecification): { source: SourceSpecification; parts: PolarParts | null } {
  if (source.type !== "geojson" || !isFeatureCollection(source.data)) {
    return { source, parts: null };
  }

  const parts: PolarParts = { lines: [], points: [] };
  const features = source.data.features.flatMap((feature) => separateFeature(feature, parts));

  if (parts.lines.length === 0 && parts.points.length === 0) {
    return { source, parts: null };
  }

  return { source: { ...source, data: { ...source.data, features } }, parts };
}

function resolve(value: unknown, properties: Properties): unknown {
  if (Array.isArray(value) && value[0] === "get" && typeof value[1] === "string") {
    return properties[value[1]];
  }

  return value;
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

function colorOr(value: unknown, fallback: string): string | null {
  if (value === undefined) return fallback;
  return typeof value === "string" ? value : null;
}

function dashOf(value: unknown, width: number): string | null {
  if (!Array.isArray(value) || !value.every((step) => typeof step === "number")) {
    return null;
  }

  return value.map((step) => step * width).join(" ");
}

function styleOf(layer: LayerSpecification): { paint: Properties; layout: Properties } {
  return {
    paint: ("paint" in layer ? layer.paint : undefined) ?? {},
    layout: ("layout" in layer ? layer.layout : undefined) ?? {},
  };
}

function lineShape(layer: LayerSpecification, line: PolarLine, index: number): ScreenLine | null {
  const { paint, layout } = styleOf(layer);
  const color = colorOr(resolve(paint["line-color"], line.properties), "#000000");
  const width = numberOr(resolve(paint["line-width"], line.properties), 1);

  if (color === null) {
    return null;
  }

  return {
    kind: "line",
    id: `${layer.id}-${index}`,
    layer: layer.id,
    path: line.path,
    color,
    width,
    opacity: numberOr(resolve(paint["line-opacity"], line.properties), 1),
    dash: dashOf(paint["line-dasharray"], width),
    cap: typeof layout["line-cap"] === "string" ? layout["line-cap"] : "butt",
    join: typeof layout["line-join"] === "string" ? layout["line-join"] : "miter",
  };
}

function pointShape(layer: LayerSpecification, point: PolarPoint, index: number): ScreenPoint | null {
  const { paint } = styleOf(layer);
  const fill = colorOr(resolve(paint["circle-color"], point.properties), "#000000");
  const stroke = colorOr(resolve(paint["circle-stroke-color"], point.properties), "#000000");

  if (fill === null || stroke === null) {
    return null;
  }

  return {
    kind: "point",
    id: `${layer.id}-${index}`,
    layer: layer.id,
    position: point.position,
    properties: point.properties,
    radius: numberOr(resolve(paint["circle-radius"], point.properties), 5),
    fill,
    fillOpacity: numberOr(resolve(paint["circle-opacity"], point.properties), 1),
    stroke,
    strokeWidth: numberOr(resolve(paint["circle-stroke-width"], point.properties), 0),
    strokeOpacity: numberOr(resolve(paint["circle-stroke-opacity"], point.properties), 1),
  };
}

function shapesOf(layer: LayerSpecification, parts: PolarParts): ScreenShape[] {
  const shapes =
    layer.type === "line"
      ? parts.lines.map((line, index) => lineShape(layer, line, index))
      : layer.type === "circle"
        ? parts.points.map((point, index) => pointShape(layer, point, index))
        : [];

  return shapes.filter((shape): shape is ScreenShape => shape !== null);
}

export function separatePolarShapes(overlay: GlobeOverlay): PolarSeparation {
  const sources: GlobeOverlay["sources"] = {};
  const parts = new Map<string, PolarParts>();

  for (const [id, source] of Object.entries(overlay.sources)) {
    const separated = separateSource(source);
    sources[id] = separated.source;
    if (separated.parts !== null) parts.set(id, separated.parts);
  }

  if (parts.size === 0) {
    return { overlay, shapes: [] };
  }

  const shapes = overlay.layers.flatMap((layer) => {
    const source = "source" in layer && typeof layer.source === "string" ? parts.get(layer.source) : undefined;
    return source === undefined ? [] : shapesOf(layer, source);
  });

  return { overlay: { sources, layers: overlay.layers }, shapes };
}
