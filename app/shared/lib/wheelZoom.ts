export const WHEEL_ZOOM_RATE = 1 / 700;
export const TRACKPAD_ZOOM_RATE = 1 / 160;
export const WHEEL_GLIDE_MS = 200;

const WHEEL_NOTCH_PIXELS = 4.000244140625;
const LINE_PIXELS = 40;
const MAX_SCALE_PER_FRAME = 2;
const GESTURE_GAP_MS = 400;
const NOTCH_PIXELS = 50;

export type WheelKind = "wheel" | "trackpad";

export function wheelPixels(event: WheelEvent): number {
  const pixels = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * LINE_PIXELS : event.deltaY;

  return event.shiftKey ? pixels / 4 : pixels;
}

export function wheelKind(pixels: number, msSinceLastEvent: number, previous: WheelKind | null): WheelKind {
  if (pixels % WHEEL_NOTCH_PIXELS === 0) return "wheel";
  if (Math.abs(pixels) < 4) return "trackpad";
  if (previous !== null && msSinceLastEvent <= GESTURE_GAP_MS) return previous;

  return Math.abs(pixels) >= NOTCH_PIXELS ? "wheel" : "trackpad";
}

export function wheelZoomChange(pixels: number, kind: WheelKind): number {
  const rate = kind === "wheel" && Math.abs(pixels) > WHEEL_NOTCH_PIXELS ? WHEEL_ZOOM_RATE : TRACKPAD_ZOOM_RATE;
  const levels = Math.log2(MAX_SCALE_PER_FRAME / (1 + Math.exp(-Math.abs(pixels * rate))));

  return pixels < 0 ? levels : -levels;
}

export function wheelGlide(progress: number): number {
  return 1 - (1 - progress) ** 3;
}
