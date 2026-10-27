import type { FlightPathElement } from "~/features/flight";

const POSITION_ENDPOINT = "/api/v1/position/";

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  return input instanceof URL ? input.href : input.url;
}

export function serveAdsbTrack(track: FlightPathElement[]): () => void {
  const realFetch = window.fetch;

  window.fetch = async (input, init) => {
    if (requestUrl(input).includes(POSITION_ENDPOINT)) {
      return new Response(JSON.stringify(track), { headers: { "Content-Type": "application/json" } });
    }

    return realFetch(input, init);
  };

  return () => {
    window.fetch = realFetch;
  };
}
