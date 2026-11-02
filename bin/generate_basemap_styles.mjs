#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inlineSources, osm } from "@versatiles/style";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "public", "map-styles");
const versatilesBase = "https://tiles.versatiles.org";

const themes = {
  positrino: { fileName: "positrino.json", colors: { label: "#9ca3af" } },
  "positrino-dark": { fileName: "positrino-dark.json", colors: {} },
};

await mkdir(outputDirectory, { recursive: true });

for (const [theme, { fileName, colors }] of Object.entries(themes)) {
  const style = await inlineSources(
    osm({ theme, colors, text: { language: "en" }, urls: { base: versatilesBase } }),
  );
  await writeFile(join(outputDirectory, fileName), `${JSON.stringify(style)}\n`);
  console.log(`Wrote public/map-styles/${fileName}`);
}
