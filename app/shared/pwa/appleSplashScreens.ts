import devices from "./appleSplashDevices.json";

type ColorScheme = "light" | "dark";

type Orientation = "portrait" | "landscape";

const colorSchemes: ColorScheme[] = ["light", "dark"];

const orientations: Orientation[] = ["portrait", "landscape"];

export function splashScreenFileName(
  { width, height, ratio }: { width: number; height: number; ratio: number },
  orientation: Orientation,
  colorScheme: ColorScheme,
): string {
  const shortEdge = width * ratio;
  const longEdge = height * ratio;

  return orientation === "portrait"
    ? `${shortEdge}x${longEdge}-${colorScheme}.png`
    : `${longEdge}x${shortEdge}-${colorScheme}.png`;
}

export const appleSplashScreenLinks = devices.flatMap((device) =>
  colorSchemes.flatMap((colorScheme) =>
    orientations.map((orientation) => ({
      rel: "apple-touch-startup-image",
      href: `/splash/${splashScreenFileName(device, orientation, colorScheme)}`,
      media: [
        `(device-width: ${device.width}px)`,
        `(device-height: ${device.height}px)`,
        `(-webkit-device-pixel-ratio: ${device.ratio})`,
        `(orientation: ${orientation})`,
        `(prefers-color-scheme: ${colorScheme})`,
      ].join(" and "),
    })),
  ),
);
