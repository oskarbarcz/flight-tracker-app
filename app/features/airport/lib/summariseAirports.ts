import { type Airport, type Continent, DataQuality } from "~/features/airport/model";

export type QualitySummary = {
  quality: DataQuality;
  count: number;
};

export type AirportContinentSummary = {
  continent: Continent;
  count: number;
  lowCount: number;
};

export function summariseQualities(airports: Airport[]): QualitySummary[] {
  return [DataQuality.Low, DataQuality.High, DataQuality.Flagship].map((quality) => ({
    quality,
    count: airports.filter((airport) => airport.dataQuality === quality).length,
  }));
}

export function summariseContinents(airports: Airport[], continents: Continent[]): AirportContinentSummary[] {
  return continents.map((continent) => {
    const held = airports.filter((airport) => airport.continent === continent);

    return {
      continent,
      count: held.length,
      lowCount: held.filter((airport) => airport.dataQuality === DataQuality.Low).length,
    };
  });
}
