type RGB = [number, number, number];

const FALLBACK_COLOR = "rgb(156, 163, 175)";

const ALTITUDE_STOPS: { alt: number; color: RGB }[] = [
  { alt: 0, color: [249, 115, 22] },
  { alt: 10000, color: [250, 204, 21] },
  { alt: 20000, color: [34, 197, 94] },
  { alt: 30000, color: [59, 130, 246] },
  { alt: 38000, color: [104, 117, 245] },
];

function toRgbString([r, g, b]: RGB): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export function altitudeToColor(altitude: number | undefined): string {
  if (altitude === undefined || Number.isNaN(altitude)) {
    return FALLBACK_COLOR;
  }

  if (altitude <= ALTITUDE_STOPS[0].alt) {
    return toRgbString(ALTITUDE_STOPS[0].color);
  }
  if (altitude >= ALTITUDE_STOPS[ALTITUDE_STOPS.length - 1].alt) {
    return toRgbString(ALTITUDE_STOPS[ALTITUDE_STOPS.length - 1].color);
  }

  for (let i = 0; i < ALTITUDE_STOPS.length - 1; i++) {
    const a = ALTITUDE_STOPS[i];
    const b = ALTITUDE_STOPS[i + 1];
    if (altitude >= a.alt && altitude <= b.alt) {
      const t = (altitude - a.alt) / (b.alt - a.alt);
      const mixed: RGB = [
        a.color[0] + (b.color[0] - a.color[0]) * t,
        a.color[1] + (b.color[1] - a.color[1]) * t,
        a.color[2] + (b.color[2] - a.color[2]) * t,
      ];
      return toRgbString(mixed);
    }
  }
  return FALLBACK_COLOR;
}

export function quantizeAltitude(altitude: number | undefined, bucketFt: number = 2000): number | undefined {
  if (altitude === undefined || Number.isNaN(altitude)) return undefined;
  return Math.round(altitude / bucketFt) * bucketFt;
}
