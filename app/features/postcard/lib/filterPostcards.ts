import { type PlacedPostcard, PostcardStatus } from "~/features/postcard/model";

export const UNSETTLED: PostcardStatus[] = [PostcardStatus.Failed, PostcardStatus.Pending];

export type PostcardFilters = {
  search: string;
  country: string;
  statuses: PostcardStatus[];
};

function matchesSearch(postcard: PlacedPostcard, search: string): boolean {
  if (search === "") {
    return true;
  }

  const needle = search.trim().toLowerCase();

  return postcard.city.name.toLowerCase().includes(needle) || postcard.country.name.toLowerCase().includes(needle);
}

export function filterPostcards(postcards: PlacedPostcard[], filters: PostcardFilters): PlacedPostcard[] {
  return postcards.filter(
    (postcard) =>
      matchesSearch(postcard, filters.search) &&
      (filters.country === "" || postcard.country.code === filters.country) &&
      (filters.statuses.length === 0 || filters.statuses.includes(postcard.status)),
  );
}

export function isFiltering(filters: PostcardFilters): boolean {
  return filters.search !== "" || filters.country !== "" || filters.statuses.length > 0;
}
