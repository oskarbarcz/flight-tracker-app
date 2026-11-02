#!/usr/bin/env node
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "public", "airspace");
const outputFile = join(outputDirectory, "fir-boundaries.geojson");
const polarOutputFile = join(outputDirectory, "fir-boundaries-polar.geojson");
const labelOutputFile = join(outputDirectory, "fir-boundary-labels.geojson");
const namesOutputFile = join(outputDirectory, "fir-names.json");
const overridesFile = join(projectRoot, "bin", "fir_boundary_overrides.json");

const repository = "vatsimnetwork/vatspy-data-project";
const requestedRef = process.env.VATSPY_REF ?? "master";
const precision = 4;
const labelPrecision = 3;
const mercatorLimit = 85.051129;
const polarStep = 0.25;
const icaoFirCode = /^[A-Z]{4}$/;
const boundaryTolerance = 0.001;
const singleLetterStates = new Set(["C", "K", "Y"]);

async function resolveCommit(ref) {
  const response = await fetch(`https://api.github.com/repos/${repository}/commits/${ref}`, {
    headers: { Accept: "application/vnd.github.sha" },
  });

  if (!response.ok) {
    throw new Error(`Cannot resolve ${repository}@${ref}: GitHub answered ${response.status}`);
  }

  return (await response.text()).trim();
}

async function fetchFile(commit, path) {
  const response = await fetch(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);

  if (!response.ok) {
    throw new Error(`Cannot download ${path}: GitHub answered ${response.status}`);
  }

  return response.text();
}

function firNames(vatSpyData) {
  const names = new Map();
  let inFirSection = false;

  for (const rawLine of vatSpyData.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith("[")) {
      inFirSection = line === "[FIRs]";
      continue;
    }

    if (!inFirSection || line === "" || line.startsWith(";")) {
      continue;
    }

    const [icao, name, callsignPrefix, boundary] = line.split("|");
    const isPrimary = icao === boundary && callsignPrefix === "";

    if (boundary && name && (isPrimary || !names.has(boundary))) {
      names.set(boundary, name.trim());
    }
  }

  return names;
}

function chartName(stationName) {
  return stationName
    .split(" - ")[0]
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+\d{3}\.\d+\*?$/, "")
    .trim()
    .toUpperCase();
}

function chartLabel(id, names, overrides) {
  const name = overrides.names[id] ?? (names.has(id) ? chartName(names.get(id)) : null);
  return name ? `${id} ${name}` : id;
}

function mergeTargets(overrides) {
  return new Map(Object.entries(overrides.merges).flatMap(([into, members]) => members.map((id) => [id, into])));
}

function round(value) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function roundPoint([longitude, latitude]) {
  return [round(longitude), round(latitude)];
}

function pointKey([longitude, latitude]) {
  return `${longitude},${latitude}`;
}

function edgeKey(from, to) {
  const a = pointKey(from);
  const b = pointKey(to);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function samePoint(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function withoutRepeats(points) {
  return points.filter((point, index) => index === 0 || !samePoint(point, points[index - 1]));
}

function signedArea(points) {
  let doubled = 0;

  for (let index = 1; index < points.length; index++) {
    const [x1, y1] = points[index - 1];
    const [x2, y2] = points[index];
    doubled += x1 * y2 - x2 * y1;
  }

  return doubled / 2;
}

function splitsAtAntimeridian(rings) {
  const longitudes = new Set(rings.flatMap(({ points }) => points.map(([longitude]) => longitude)));
  return longitudes.has(180) && longitudes.has(-180);
}

function isAntimeridianSeam(from, to) {
  return Math.abs(from[0]) === 180 && from[0] === to[0];
}

function isVatsimOverlay(id, stationName) {
  return id.startsWith("X") || id.endsWith("XX") || /\b(military|fis)\b/i.test(stationName);
}

function firNameTable(names, overrides) {
  const table = new Map(Object.entries(overrides.names));

  for (const [id, stationName] of names) {
    if (!table.has(id) && icaoFirCode.test(id) && !isVatsimOverlay(id, stationName)) {
      table.set(id, chartName(stationName));
    }
  }

  for (const [member, target] of mergeTargets(overrides)) {
    if (table.has(target)) {
      table.set(member, table.get(target));
    }
  }

  return Object.fromEntries([...table].sort(([a], [b]) => a.localeCompare(b)));
}

function statePrefix(id) {
  return singleLetterStates.has(id[0]) ? id[0] : id.slice(0, 2);
}

function featureRings(feature) {
  return feature.geometry.coordinates.flatMap((polygon) =>
    polygon.map((ring, index) => {
      const points = withoutRepeats(ring.map(roundPoint));
      const isHole = index > 0;
      return { points, firOnLeft: signedArea(points) > 0 !== isHole };
    }),
  );
}

function labelPoint(feature) {
  return roundPoint([Number(feature.properties.label_lon), Number(feature.properties.label_lat)]);
}

function topLevelFirs(boundaries, names, targets) {
  const firs = new Map();

  for (const feature of boundaries.features) {
    const { id } = feature.properties;

    if (!icaoFirCode.test(id) || isVatsimOverlay(id, names.get(id) ?? "")) {
      continue;
    }

    const target = targets.get(id) ?? id;
    const rings = featureRings(feature);
    const fir = firs.get(target) ?? { rings: [], label: null, labelIsOwn: false, labelArea: 0 };
    const featureArea = area(rings);
    const isOwn = id === target;

    fir.rings.push(...rings);

    if (!fir.labelIsOwn && (isOwn || featureArea > fir.labelArea)) {
      fir.label = labelPoint(feature);
      fir.labelIsOwn = isOwn;
      fir.labelArea = featureArea;
    }

    firs.set(target, fir);
  }

  return [...firs.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function boundingBox(rings) {
  const points = rings.flatMap(({ points }) => points);
  const longitudes = points.map(([longitude]) => longitude);
  const latitudes = points.map(([, latitude]) => latitude);

  return {
    west: Math.min(...longitudes),
    east: Math.max(...longitudes),
    south: Math.min(...latitudes),
    north: Math.max(...latitudes),
  };
}

function containsBox(outer, inner) {
  return outer.west <= inner.west && outer.east >= inner.east && outer.south <= inner.south && outer.north >= inner.north;
}

function onSegment([x, y], [x1, y1], [x2, y2]) {
  const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
  const length = Math.hypot(x2 - x1, y2 - y1);

  if (length === 0 || Math.abs(cross) / length > boundaryTolerance) {
    return false;
  }

  const along = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (length * length);
  return along >= 0 && along <= 1;
}

function locate(point, rings) {
  let inside = false;

  for (const { points } of rings) {
    for (let index = 1; index < points.length; index++) {
      const from = points[index - 1];
      const to = points[index];

      if (onSegment(point, from, to)) {
        return "boundary";
      }

      if (from[1] > point[1] !== to[1] > point[1]) {
        const crossingLongitude = from[0] + ((point[1] - from[1]) / (to[1] - from[1])) * (to[0] - from[0]);
        if (point[0] < crossingLongitude) inside = !inside;
      }
    }
  }

  return inside ? "inside" : "outside";
}

function liesWithin(inner, outer) {
  return (
    locate(inner.label, outer.rings) === "inside" &&
    inner.rings.every(({ points }) => points.every((point) => locate(point, outer.rings) !== "outside"))
  );
}

function area(rings) {
  return rings.reduce((total, { points }) => total + Math.abs(signedArea(points)), 0);
}

function withoutNestedAreas(firs) {
  const measured = firs.map(([id, { rings, label }]) => ({
    id,
    rings,
    label,
    box: boundingBox(rings),
    area: area(rings),
  }));
  const nested = new Map();

  for (const inner of measured) {
    const outer = measured.find(
      (candidate) =>
        candidate !== inner &&
        statePrefix(candidate.id) === statePrefix(inner.id) &&
        candidate.area > inner.area &&
        containsBox(candidate.box, inner.box) &&
        liesWithin(inner, candidate),
    );

    if (outer !== undefined) {
      nested.set(inner.id, outer.id);
    }
  }

  return { kept: firs.filter(([id]) => !nested.has(id)), nested };
}

function edgeOwners(firs) {
  const owners = new Map();

  for (const [id, { rings }] of firs) {
    for (const { points } of rings) {
      for (let index = 1; index < points.length; index++) {
        const key = edgeKey(points[index - 1], points[index]);
        const counts = owners.get(key) ?? new Map();
        counts.set(id, (counts.get(id) ?? 0) + 1);
        owners.set(key, counts);
      }
    }
  }

  return owners;
}

function isInterior(owners, key, id) {
  return (owners.get(key)?.get(id) ?? 0) > 1;
}

function ringRuns(points, skips) {
  const runs = [];
  let run = null;

  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];

    if (skips(from, to)) {
      run = null;
      continue;
    }

    if (run === null) {
      run = { points: [from], startsAtRingStart: index === 1 };
      runs.push(run);
    }

    run.points.push(to);
    run.endsAtRingEnd = index === points.length - 1;
  }

  const first = runs[0];
  const last = runs.at(-1);

  if (runs.length > 1 && first.startsAtRingStart && last.endsAtRingEnd) {
    last.points.push(...first.points.slice(1));
    runs.shift();
  }

  return runs.map((entry) => entry.points);
}

function isPolar([, latitude]) {
  return Math.abs(latitude) > mercatorLimit;
}

function isLine(points) {
  return points.length > 1;
}

function atPole([, latitude]) {
  return Math.abs(latitude) === 90;
}

function mercatorCrossing(from, to) {
  const boundary = Math.sign(isPolar(from) ? from[1] : to[1]) * mercatorLimit;
  const fraction = (boundary - from[1]) / (to[1] - from[1]);
  return [round(from[0] + fraction * (to[0] - from[0])), boundary];
}

function interpolate(from, to, fraction) {
  return [round(from[0] + fraction * (to[0] - from[0])), round(from[1] + fraction * (to[1] - from[1]))];
}

function polarSteps(from, to) {
  const middleLatitude = ((from[1] + to[1]) / 2) * (Math.PI / 180);
  const span = Math.max(Math.abs(to[1] - from[1]), Math.abs(to[0] - from[0]) * Math.cos(middleLatitude));
  return Math.max(1, Math.ceil(span / polarStep));
}

function polarPath(points) {
  const path = [points[0]];

  for (let index = 1; index < points.length; index++) {
    const from = points[index - 1];
    const to = points[index];

    if (atPole(from) && atPole(to)) {
      continue;
    }

    const start = atPole(from) ? [to[0], from[1]] : from;
    const end = atPole(to) ? [from[0], to[1]] : to;
    const steps = polarSteps(start, end);

    for (let step = 1; step <= steps; step++) {
      path.push(interpolate(start, end, step / steps));
    }
  }

  return path;
}

function splitAtMercatorLimit(line) {
  const tiled = [];
  const polar = [];
  let part = [line[0]];
  let partIsPolar = isPolar(line[0]);

  for (let index = 1; index < line.length; index++) {
    const from = line[index - 1];
    const to = line[index];

    if (isPolar(to) === partIsPolar) {
      part.push(to);
      continue;
    }

    const edge = mercatorCrossing(from, to);
    part.push(edge);
    (partIsPolar ? polar : tiled).push(part);
    part = [edge, to];
    partIsPolar = !partIsPolar;
  }

  (partIsPolar ? polar : tiled).push(part);

  return { tiled: tiled.filter(isLine), polar: polar.map(polarPath).filter(isLine) };
}

function coarse(points) {
  const factor = 10 ** labelPrecision;
  return withoutRepeats(points.map((point) => point.map((value) => Math.round(value * factor) / factor)));
}

function lineFeature(points, properties = {}) {
  return { type: "Feature", properties, geometry: { type: "LineString", coordinates: points } };
}

function codeFeature(id, label) {
  return { type: "Feature", properties: { code: id }, geometry: { type: "Point", coordinates: label } };
}

function boundaryFeatures(firs, names, overrides) {
  const emitted = new Set();
  const owners = edgeOwners(firs);
  const lines = [];
  const labelPaths = [];
  const polar = [];

  for (const [id, { rings }] of firs) {
    const skipsSeams = splitsAtAntimeridian(rings);
    const isOutline = (from, to) =>
      !isInterior(owners, edgeKey(from, to), id) && !(skipsSeams && isAntimeridianSeam(from, to));
    const isNewOutline = (from, to) => {
      const key = edgeKey(from, to);
      if (emitted.has(key) || !isOutline(from, to)) return false;
      emitted.add(key);
      return true;
    };
    const label = chartLabel(id, names, overrides);

    for (const ring of rings) {
      for (const run of ringRuns(ring.points, (from, to) => !isNewOutline(from, to))) {
        const parts = splitAtMercatorLimit(run);
        lines.push(...parts.tiled.map((points) => lineFeature(points)));
        polar.push(...parts.polar.map((points) => lineFeature(points)));
      }

      const side = ring.firOnLeft ? "left" : "right";

      for (const run of ringRuns(ring.points, (from, to) => !isOutline(from, to))) {
        labelPaths.push(
          ...splitAtMercatorLimit(run)
            .tiled.map(coarse)
            .filter(isLine)
            .map((points) => lineFeature(points, { label, side })),
        );
      }
    }
  }

  const codes = firs.map(([id, { label }]) => codeFeature(id, label));

  return { tiled: [...lines, ...codes], labelPaths, polar };
}

function featureCollection(name, features) {
  return {
    type: "FeatureCollection",
    name,
    attribution: "VATSpy Data Project",
    license: "CC-BY-SA-4.0",
    source: `https://github.com/${repository}`,
    features,
  };
}

function isBoundaryLine({ geometry, properties }) {
  return geometry.type === "LineString" && properties.label === undefined;
}

function lineCount(features) {
  return features.filter(isBoundaryLine).length;
}

function pointCount(features) {
  return features.filter(isBoundaryLine).reduce((total, feature) => total + feature.geometry.coordinates.length, 0);
}

function warnAboutMissingMembers(boundaries, overrides) {
  const ids = new Set(boundaries.features.map(({ properties }) => properties.id));
  const missing = Object.values(overrides.merges)
    .flat()
    .filter((id) => !ids.has(id));

  if (missing.length > 0) {
    console.warn(`VATSpy no longer has ${missing.join(", ")}; update bin/fir_boundary_overrides.json`);
  }
}

const commit = await resolveCommit(requestedRef);
const [boundariesText, vatSpyData] = await Promise.all([
  fetchFile(commit, "Boundaries.geojson"),
  fetchFile(commit, "VATSpy.dat"),
]);
const overrides = JSON.parse(await readFile(overridesFile, "utf8"));
const boundaries = JSON.parse(boundariesText);
const names = firNames(vatSpyData);
const { kept: firs, nested } = withoutNestedAreas(topLevelFirs(boundaries, names, mergeTargets(overrides)));
const { tiled, labelPaths, polar } = boundaryFeatures(firs, names, overrides);

warnAboutMissingMembers(boundaries, overrides);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify(featureCollection("FIR boundaries", tiled))}\n`);
await writeFile(labelOutputFile, `${JSON.stringify(featureCollection("FIR boundary labels", labelPaths))}\n`);
await writeFile(polarOutputFile, `${JSON.stringify(featureCollection("FIR boundaries beyond 85°", polar))}\n`);
await writeFile(namesOutputFile, `${JSON.stringify(firNameTable(names, overrides))}\n`);

if (process.env.FIR_VERBOSE) {
  console.log([...nested].map(([inner, outer]) => `${inner} in ${outer}`).join(", "));
}

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `vatspy_commit=${commit}\n`);
}

console.log(
  `Wrote public/airspace from ${repository}@${commit.slice(0, 7)}: ${firs.length} FIRs, ${lineCount(tiled)} boundary lines (${pointCount(tiled)} points), ${polar.length} beyond 85° (${pointCount(polar)} points)`,
);
