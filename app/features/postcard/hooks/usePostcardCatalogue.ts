import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { City } from "~/features/city/model";
import { useCountries } from "~/features/country";
import { placePostcards } from "~/features/postcard/lib/place";
import { type PlacedPostcard, type PostcardCatalogue, PostcardStatus } from "~/features/postcard/model";
import { useApi } from "~/shared/api/useApi";

const POLL_INTERVAL_MS = 5000;

const EMPTY: PostcardCatalogue = { postcards: [] };

export type PostcardCatalogueState = {
  postcards: PlacedPostcard[] | null;
  citiesWithoutPostcard: City[];
  isDrawing: boolean;
  reload: () => void;
};

export function usePostcardCatalogue(): PostcardCatalogueState {
  const { postcardService, cityService } = useApi();
  const countries = useCountries();
  const [catalogue, setCatalogue] = useState<PostcardCatalogue | null>(null);
  const [citiesWithoutPostcard, setCitiesWithoutPostcard] = useState<City[]>([]);
  const latestRequest = useRef(0);

  const reload = useCallback(() => {
    latestRequest.current += 1;
    const request = latestRequest.current;

    const isLatest = () => request === latestRequest.current;

    postcardService
      .fetchCatalogue()
      .catch(() => EMPTY)
      .then((next) => {
        if (isLatest()) {
          setCatalogue(next);
        }
      });

    cityService
      .fetchWithoutPostcard()
      .catch((): City[] => [])
      .then((cities) => {
        if (isLatest()) {
          setCitiesWithoutPostcard(cities);
        }
      });
  }, [postcardService, cityService]);

  useEffect(reload, [reload]);

  const isDrawing = catalogue?.postcards.some(({ status }) => status === PostcardStatus.Pending) ?? false;

  useEffect(() => {
    if (!isDrawing) {
      return;
    }

    const timer = setInterval(reload, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isDrawing, reload]);

  const postcards = useMemo(
    () => (catalogue === null ? null : placePostcards(catalogue.postcards, countries)),
    [catalogue, countries],
  );

  return {
    postcards,
    citiesWithoutPostcard,
    isDrawing,
    reload,
  };
}
