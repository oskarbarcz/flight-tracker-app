import { allContinents, type Continent } from "~/features/airport/model";
import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";
import { toHuman } from "~/i18n/translate";

export const ELSEWHERE = "elsewhere";

export type CountryGroup = {
  code: string;
  name: string;
  postcards: PlacedPostcard[];
  failedCount: number;
};

export type ContinentSummary = {
  key: string;
  name: string;
  postcardCount: number;
  failedCount: number;
};

export function continentKey(continent: Continent | null): string {
  return continent ?? ELSEWHERE;
}

function continentName(key: string): string {
  return key === ELSEWHERE ? "Elsewhere" : toHuman.airport.continent(key as Continent);
}

export function summariseContinents(postcards: PlacedPostcard[]): ContinentSummary[] {
  const keys = allContinents().map(continentKey);

  if (postcards.some((postcard) => postcard.continent === null)) {
    keys.push(ELSEWHERE);
  }

  return keys.map((key) => {
    const held = postcards.filter((postcard) => continentKey(postcard.continent) === key);

    return {
      key,
      name: continentName(key),
      postcardCount: held.length,
      failedCount: held.filter(({ status }) => status === PostcardStatus.Failed).length,
    };
  });
}

export function groupPostcards(postcards: PlacedPostcard[]): CountryGroup[] {
  const groups = new Map<string, CountryGroup>();

  for (const postcard of postcards) {
    const { code, name } = postcard.country;
    const group = groups.get(code) ?? { code, name, postcards: [], failedCount: 0 };

    group.postcards.push(postcard);

    if (postcard.status === PostcardStatus.Failed) {
      group.failedCount += 1;
    }

    groups.set(code, group);
  }

  for (const group of groups.values()) {
    group.postcards.sort((left, right) => left.city.name.localeCompare(right.city.name));
  }

  return [...groups.values()].sort((left, right) => left.name.localeCompare(right.name));
}
