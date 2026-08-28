const EQUATOR_CIRCUMFERENCE_METERS = 40075016.686;
const TILE_SIZE_EXPONENT = 8;

export function metersPerPixel(latitude: number, zoom: number): number {
  return (EQUATOR_CIRCUMFERENCE_METERS * Math.cos((latitude * Math.PI) / 180)) / 2 ** (zoom + TILE_SIZE_EXPONENT);
}

export function metersToDashArray(latitude: number, zoom: number, dashMeters: number, gapMeters: number): string {
  const scale = metersPerPixel(latitude, zoom);
  return `${(dashMeters / scale).toFixed(2)} ${(gapMeters / scale).toFixed(2)}`;
}
