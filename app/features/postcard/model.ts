import type { Continent } from "~/features/airport/model";
import type { CityRef } from "~/features/city/model";
import type { CountryRef } from "~/features/country/model";

export enum PostcardStatus {
  Pending = "pending",
  Ready = "ready",
  Failed = "failed",
}

export type CataloguePostcard = {
  id: string;
  city: CityRef;
  country: CountryRef;
  imageUrl: string | null;
  width: number | null;
  height: number | null;
  status: PostcardStatus;
  statusChangedAt: string | null;
  failureReason: string | null;
  heldBy: number;
};

export type PlacedPostcard = CataloguePostcard & {
  continent: Continent | null;
};

export type PostcardCatalogue = {
  postcards: CataloguePostcard[];
};

export type DrawMissingResult = {
  queued: number;
  cities: CityRef[];
};

export type RedrawOutcome = "replaced" | "already-drawing";
