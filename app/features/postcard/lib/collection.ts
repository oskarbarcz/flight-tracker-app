import type { CountryRef } from "~/features/country/model";
import { type CollectedPostcard, type MyPostcard, PostcardStatus } from "~/features/postcard/model";

function hasArt(postcard: MyPostcard): postcard is CollectedPostcard {
  return postcard.status === PostcardStatus.Ready && postcard.imageUrl !== null;
}

function awardedAt(postcard: CollectedPostcard): number {
  return new Date(postcard.awardedAt).getTime();
}

export function collected(postcards: MyPostcard[]): CollectedPostcard[] {
  return postcards.filter(hasArt).sort((left, right) => awardedAt(right) - awardedAt(left));
}

export function neverSeen(postcards: CollectedPostcard[]): CollectedPostcard[] {
  return postcards.filter(({ seenAt }) => seenAt === null).sort((left, right) => awardedAt(left) - awardedAt(right));
}

export function countriesHeld(postcards: CollectedPostcard[]): CountryRef[] {
  const named = new Map<string, string>();

  for (const { country } of postcards) {
    named.set(country.code, country.name);
  }

  return [...named.entries()]
    .map(([code, name]) => ({ code, name }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function inCountry(postcards: CollectedPostcard[], code: string): CollectedPostcard[] {
  return code === "" ? postcards : postcards.filter(({ country }) => country.code === code);
}
