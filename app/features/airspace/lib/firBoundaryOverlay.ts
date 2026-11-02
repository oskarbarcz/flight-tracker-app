import type { FeatureCollection } from "geojson";
import type { ExpressionSpecification, LayerSpecification } from "maplibre-gl";
import type { FlightDataDisplay } from "~/app-state/useMapSettings";
import { emphasisOf } from "~/shared/lib/flightData";
import type { GlobeOverlay } from "~/shared/lib/globeStyle";
import type { BasemapTheme } from "~/shared/lib/versatilesBasemap";

export const FIR_BOUNDARIES_SOURCE = "fir-boundaries";
export const FIR_POLAR_BOUNDARIES_SOURCE = "fir-boundaries-polar";
export const FIR_LABEL_PATHS_SOURCE = "fir-boundaries-label-paths";

type BoundarySide = "left" | "right";

const DATA_PATH = "airspace/fir-boundaries.geojson";
const POLAR_DATA_PATH = "airspace/fir-boundaries-polar.geojson";
const LABEL_DATA_PATH = "airspace/fir-boundary-labels.geojson";
const CODE_MIN_ZOOM = 1.5;
const NAME_MIN_ZOOM = 4;
const LABEL_SPACING = 260;
const LABEL_PATH_TOLERANCE = 10;
const LABEL_PATH_BUFFER = 512;
const LABEL_DISTANCE_EM = 1.05;
const ICAO_CODE_LENGTH = 4;
const LINE_OPACITY = 0.9;
const CODE_OPACITY = 0.6;
const POLAR_LINE_WIDTH = 1;

const palette: Record<BasemapTheme, { line: string; label: string; halo: string }> = {
  light: { line: "#6b7280", label: "#4b5563", halo: "#f9fafb" },
  dark: { line: "#9ca3af", label: "#9ca3af", halo: "#030712" },
};

const NO_OVERLAY: GlobeOverlay = { sources: {}, layers: [] };

const lineWidth: ExpressionSpecification = ["interpolate", ["linear"], ["zoom"], 2, 0.8, 6, 1.3, 10, 1.8];

const nameSize: ExpressionSpecification = ["interpolate", ["linear"], ["zoom"], NAME_MIN_ZOOM, 10, 8, 11.5];

const codeSize: ExpressionSpecification = ["interpolate", ["linear"], ["zoom"], CODE_MIN_ZOOM, 18, NAME_MIN_ZOOM, 24];

const sideOffset: Record<BoundarySide, [number, number]> = {
  left: [0, -LABEL_DISTANCE_EM],
  right: [0, LABEL_DISTANCE_EM],
};

let pendingPolarLines: Promise<FeatureCollection | null> | null = null;

function dataUrl(path: string): string {
  return new URL(`${import.meta.env.BASE_URL}${path}`, window.location.href).href;
}

async function fetchPolarLines(): Promise<FeatureCollection | null> {
  try {
    const response = await fetch(dataUrl(POLAR_DATA_PATH));

    if (!response.ok) {
      throw new Error(`${POLAR_DATA_PATH} answered ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cannot load the FIR boundaries beyond 85°", error);

    return null;
  }
}

export function loadFirPolarLines(): Promise<FeatureCollection | null> {
  pendingPolarLines ??= fetchPolarLines();

  return pendingPolarLines;
}

function boundaryLine(
  id: string,
  source: string,
  color: string,
  emphasis: number,
  width: number | ExpressionSpecification,
): LayerSpecification {
  return {
    id,
    type: "line",
    source,
    layout: { "line-join": "round" },
    paint: {
      "line-color": color,
      "line-width": width,
      "line-opacity": LINE_OPACITY * emphasis,
      "line-dasharray": [7, 2.5, 1.5, 2.5],
    },
  };
}

function sideLabel(side: BoundarySide, theme: BasemapTheme, emphasis: number): LayerSpecification {
  const colors = palette[theme];

  return {
    id: `fir-boundary-label-${side}`,
    type: "symbol",
    source: FIR_LABEL_PATHS_SOURCE,
    minzoom: NAME_MIN_ZOOM,
    filter: ["==", ["get", "side"], side],
    layout: {
      "symbol-placement": "line",
      "symbol-spacing": LABEL_SPACING,
      "text-field": [
        "format",
        ["slice", ["get", "label"], 0, ICAO_CODE_LENGTH],
        { "text-font": ["literal", ["noto_sans_bold"]] },
        ["slice", ["get", "label"], ICAO_CODE_LENGTH],
        { "text-font": ["literal", ["noto_sans_regular"]] },
      ],
      "text-font": ["noto_sans_regular"],
      "text-size": nameSize,
      "text-letter-spacing": 0.06,
      "text-offset": sideOffset[side],
      "text-padding": 0,
    },
    paint: {
      "text-color": colors.label,
      "text-opacity": emphasis,
      "text-halo-color": colors.halo,
      "text-halo-width": 1.5,
    },
  };
}

function centreCode(theme: BasemapTheme, emphasis: number): LayerSpecification {
  const colors = palette[theme];

  return {
    id: "fir-boundary-code",
    type: "symbol",
    source: FIR_BOUNDARIES_SOURCE,
    minzoom: CODE_MIN_ZOOM,
    maxzoom: NAME_MIN_ZOOM,
    filter: ["has", "code"],
    layout: {
      "text-field": ["get", "code"],
      "text-font": ["noto_sans_regular"],
      "text-size": codeSize,
      "text-letter-spacing": 0.06,
      "text-padding": 2,
    },
    paint: {
      "text-color": colors.label,
      "text-opacity": CODE_OPACITY * emphasis,
      "text-halo-color": colors.halo,
      "text-halo-width": 1.5,
    },
  };
}

export function firBoundaryOverlay(
  display: FlightDataDisplay,
  theme: BasemapTheme,
  polarLines: FeatureCollection | null = null,
): GlobeOverlay {
  if (display === "hide") {
    return NO_OVERLAY;
  }

  const emphasis = emphasisOf(display);
  const { line } = palette[theme];
  const boundaries: GlobeOverlay = {
    sources: {
      [FIR_BOUNDARIES_SOURCE]: { type: "geojson", data: dataUrl(DATA_PATH) },
      [FIR_LABEL_PATHS_SOURCE]: {
        type: "geojson",
        data: dataUrl(LABEL_DATA_PATH),
        tolerance: LABEL_PATH_TOLERANCE,
        buffer: LABEL_PATH_BUFFER,
      },
    },
    layers: [
      boundaryLine("fir-boundary-line", FIR_BOUNDARIES_SOURCE, line, emphasis, lineWidth),
      sideLabel("left", theme, emphasis),
      sideLabel("right", theme, emphasis),
      centreCode(theme, emphasis),
    ],
  };

  if (polarLines === null) {
    return boundaries;
  }

  return {
    sources: { ...boundaries.sources, [FIR_POLAR_BOUNDARIES_SOURCE]: { type: "geojson", data: polarLines } },
    layers: [
      boundaryLine("fir-boundary-polar-line", FIR_POLAR_BOUNDARIES_SOURCE, line, emphasis, POLAR_LINE_WIDTH),
      ...boundaries.layers,
    ],
  };
}
