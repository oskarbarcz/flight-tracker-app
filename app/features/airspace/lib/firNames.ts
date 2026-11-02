import { dataUrl } from "~/features/airspace/lib/firBoundaryOverlay";

export type FirNames = Record<string, string>;

const NAMES_DATA_PATH = "airspace/fir-names.json";

let pendingNames: Promise<FirNames> | null = null;

async function fetchFirNames(): Promise<FirNames> {
  try {
    const response = await fetch(dataUrl(NAMES_DATA_PATH));

    if (!response.ok) {
      throw new Error(`${NAMES_DATA_PATH} answered ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cannot load the FIR names", error);
    pendingNames = null;

    return {};
  }
}

export function loadFirNames(): Promise<FirNames> {
  pendingNames ??= fetchFirNames();

  return pendingNames;
}
