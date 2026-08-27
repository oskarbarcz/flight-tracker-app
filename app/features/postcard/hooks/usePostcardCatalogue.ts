import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CityRef } from "~/features/city/model";
import { useCountries } from "~/features/country";
import { placePostcards } from "~/features/postcard/lib/place";
import { type PlacedPostcard, type PostcardCatalogue, PostcardStatus } from "~/features/postcard/model";
import { useApi } from "~/shared/api/useApi";

const POLL_INTERVAL_MS = 5000;

const EMPTY: PostcardCatalogue = { postcards: [], citiesWithoutPostcard: [] };

export type PostcardCatalogueState = {
  postcards: PlacedPostcard[] | null;
  citiesWithoutPostcard: CityRef[];
  isDrawing: boolean;
  reload: () => void;
};

export function usePostcardCatalogue(): PostcardCatalogueState {
  const { postcardService } = useApi();
  const countries = useCountries();
  const [catalogue, setCatalogue] = useState<PostcardCatalogue | null>(null);
  const latestRequest = useRef(0);

  const reload = useCallback(() => {
    latestRequest.current += 1;
    const request = latestRequest.current;

    const settle = (next: PostcardCatalogue) => {
      if (request === latestRequest.current) {
        setCatalogue(next);
      }
    };

    postcardService
      .fetchCatalogue()
      .then(settle)
      .catch(() => settle(EMPTY));
  }, [postcardService]);

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
    citiesWithoutPostcard: catalogue?.citiesWithoutPostcard ?? [],
    isDrawing,
    reload,
  };
}
