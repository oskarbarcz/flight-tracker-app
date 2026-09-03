#!/usr/bin/env node
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const splashDirectory = join(projectRoot, "public", "splash");
const iconDirectory = join(projectRoot, "public", "icons");

const lightBackground = "#f9fafb";
const darkBackground = "oklch(13% 0.028 261.692)";
const brandIndigo = "#6875f5";

const iconBackground = lightBackground;
const iconMarkCoverage = 0.712;
const maskableMarkCoverage = 0.61;

const fontStylesheetUrl = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=block";
const woff2UserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";

const renderConcurrency = 4;

async function subdirectories(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directory, entry.name))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

async function resolveHeadlessShell() {
  if (process.env.CHROME_HEADLESS_SHELL !== undefined) {
    return process.env.CHROME_HEADLESS_SHELL;
  }

  const installRoots = [join(homedir(), ".cache", "puppeteer"), projectRoot];

  for (const installRoot of installRoots) {
    for (const version of await subdirectories(join(installRoot, "chrome-headless-shell"))) {
      for (const platform of await subdirectories(version)) {
        const binary = join(platform, "chrome-headless-shell");
        if (existsSync(binary)) {
          return binary;
        }
      }
    }
  }

  throw new Error(
    [
      "chrome-headless-shell not found. Install it with",
      "",
      "  npx @puppeteer/browsers install chrome-headless-shell@stable --path ~/.cache/puppeteer",
      "",
      "or point CHROME_HEADLESS_SHELL at an existing binary. Full Chrome cannot be used here:",
      "its headless mode clamps narrow windows to a minimum width, which shifts the artwork off centre.",
    ].join("\n"),
  );
}

async function fetchLatinFontFaces() {
  const response = await fetch(fontStylesheetUrl, { headers: { "User-Agent": woff2UserAgent } });
  if (!response.ok) {
    throw new Error(`Google Fonts returned ${response.status} for the Noto Sans stylesheet.`);
  }

  const faces = (await response.text())
    .split("/*")
    .filter((block) => block.startsWith(" latin */"))
    .map((block) => ({
      weight: Number(block.match(/font-weight:\s*(\d+)/)?.[1]),
      source: block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/)?.[1],
    }))
    .filter(({ weight, source }) => Number.isFinite(weight) && source !== undefined);

  if (faces.length !== 2) {
    throw new Error(`Expected two latin Noto Sans faces in the Google Fonts stylesheet, found ${faces.length}.`);
  }

  const sources = [...new Set(faces.map(({ source }) => source))];
  const encoded = new Map(
    await Promise.all(
      sources.map(async (source) => {
        const font = await fetch(source);
        if (!font.ok) {
          throw new Error(`Google Fonts returned ${font.status} for ${source}.`);
        }

        return [source, Buffer.from(await font.arrayBuffer()).toString("base64")];
      }),
    ),
  );

  const declarations = sources.map((source) => {
    const weights = faces.filter((face) => face.source === source).map(({ weight }) => weight);
    const range = [Math.min(...weights), Math.max(...weights)];
    const weight = [...new Set(range)].join(" ");

    return [
      "@font-face{",
      'font-family:"Noto Sans";font-style:normal;font-stretch:100%;font-display:block;',
      `font-weight:${weight};`,
      `src:url(data:font/woff2;base64,${encoded.get(source)}) format("woff2")`,
      "}",
    ].join("");
  });

  return declarations.join("");
}

async function readMarkDataUri(fileName) {
  const markup = await readFile(join(projectRoot, "app", "assets", fileName), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;
}

function splashDocument({ background, markDataUri, wordmarkColor, fontFaces }) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><style>
${fontFaces}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{display:flex;align-items:center;justify-content:center;background:${background};
font-family:"Noto Sans",sans-serif;-webkit-font-smoothing:antialiased}
.mark{display:block;margin:0 auto 1rem;width:3.5rem;height:3.5rem}
.wordmark{font-weight:400;font-size:1.5rem;line-height:2rem;color:${wordmarkColor};text-align:center}
.wordmark span{font-weight:700}
@media (min-width:768px){
.mark{margin-bottom:2rem;width:6rem;height:6rem}
.wordmark{font-size:2.25rem;line-height:2.5rem}
}
</style></head>
<body><div><img class="mark" src="${markDataUri}" alt="">
<p class="wordmark">my<span>preflight</span></p></div></body>
</html>`;
}

function iconDocument({ markDataUri, coverage }) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%}
body{display:flex;align-items:center;justify-content:center;background:${iconBackground}}
img{display:block;width:${coverage * 100}%;height:${coverage * 100}%}
</style></head>
<body><img src="${markDataUri}" alt=""></body>
</html>`;
}

function readPngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function renderPng({ browser, profileDirectory, document, outputPath, width, height, ratio }) {
  const documentPath = join(profileDirectory, "page.html");
  await writeFile(documentPath, document, "utf8");

  await execFileAsync(browser, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profileDirectory}`,
    `--force-device-scale-factor=${ratio}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outputPath}`,
    "--virtual-time-budget=2000",
    `file://${documentPath}`,
  ]);

  const rendered = readPngSize(await readFile(outputPath));
  const expected = { width: width * ratio, height: height * ratio };
  if (rendered.width !== expected.width || rendered.height !== expected.height) {
    throw new Error(
      `${outputPath} rendered at ${rendered.width}x${rendered.height}, expected ${expected.width}x${expected.height}.`,
    );
  }
}

async function runInPool(jobs, browser) {
  const queue = [...jobs];
  const workers = Array.from({ length: Math.min(renderConcurrency, queue.length) }, async () => {
    const profileDirectory = await mkdtemp(join(tmpdir(), "mypreflight-pwa-assets-"));

    try {
      for (let job = queue.shift(); job !== undefined; job = queue.shift()) {
        await renderPng({ browser, profileDirectory, ...job });
        process.stdout.write(`  ${job.label}\n`);
      }
    } finally {
      await rm(profileDirectory, { recursive: true, force: true });
    }
  });

  await Promise.all(workers);
}

function splashJobs({ devices, marks, fontFaces }) {
  const themes = [
    { colorScheme: "light", background: lightBackground, mark: marks.indigo, wordmarkColor: brandIndigo },
    { colorScheme: "dark", background: darkBackground, mark: marks.white, wordmarkColor: "#ffffff" },
  ];

  return devices.flatMap((device) =>
    themes.flatMap(({ colorScheme, background, mark, wordmarkColor }) =>
      ["portrait", "landscape"].map((orientation) => {
        const portrait = orientation === "portrait";
        const width = portrait ? device.width : device.height;
        const height = portrait ? device.height : device.width;
        const shortEdge = device.width * device.ratio;
        const longEdge = device.height * device.ratio;
        const fileName = portrait
          ? `${shortEdge}x${longEdge}-${colorScheme}.png`
          : `${longEdge}x${shortEdge}-${colorScheme}.png`;

        return {
          label: `${fileName.padEnd(22)} ${device.device}`,
          document: splashDocument({ background, markDataUri: mark, wordmarkColor, fontFaces }),
          outputPath: join(splashDirectory, fileName),
          width,
          height,
          ratio: device.ratio,
        };
      }),
    ),
  );
}

function iconJobs({ marks }) {
  const icons = [
    { fileName: "icon-192.png", size: 192, coverage: iconMarkCoverage },
    { fileName: "icon-512.png", size: 512, coverage: iconMarkCoverage },
    { fileName: "icon-maskable-512.png", size: 512, coverage: maskableMarkCoverage },
    { fileName: "apple-touch-icon.png", size: 180, coverage: iconMarkCoverage },
  ];

  return icons.map(({ fileName, size, coverage }) => ({
    label: fileName,
    document: iconDocument({ markDataUri: marks.indigo, coverage }),
    outputPath: join(iconDirectory, fileName),
    width: size,
    height: size,
    ratio: 1,
  }));
}

const browser = await resolveHeadlessShell();
const devices = JSON.parse(await readFile(join(projectRoot, "app", "shared", "pwa", "appleSplashDevices.json"), "utf8"));
const marks = {
  indigo: await readMarkDataUri("logo.svg"),
  white: await readMarkDataUri("logo.white.svg"),
};
const fontFaces = await fetchLatinFontFaces();

await rm(splashDirectory, { recursive: true, force: true });
await mkdir(splashDirectory, { recursive: true });
await mkdir(iconDirectory, { recursive: true });

process.stdout.write(`Rendering with ${browser}\n\nIcons\n`);
await runInPool(iconJobs({ marks }), browser);

process.stdout.write(`\niOS splash screens (${devices.length} devices)\n`);
await runInPool(splashJobs({ devices, marks, fontFaces }), browser);

process.stdout.write("\nDone.\n");
