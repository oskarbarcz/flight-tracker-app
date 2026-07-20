import { io, type Socket } from "socket.io-client";
import type { FlightEvent } from "~/features/flight";
import { getFlightTrackerApiHost } from "~/shared/lib/getFlightTrackerApiHost";
import { refreshAccessToken } from "~/shared/lib/refreshAccessToken";
import { readAccessToken } from "~/shared/lib/tokenStorage";

const FLIGHT_EVENTS_NAMESPACE = "/flight-events";
const MAX_REAUTH_ATTEMPTS = 3;

type FlightEventResponse = Omit<FlightEvent, "createdAt"> & { createdAt: string };

export type FlightConnectionStatus = "connecting" | "live" | "reconnecting" | "lost";

export type FlightSubscribeError = { flightId: string; message: string };

export type FlightEventsListeners = {
  onHistory: (events: FlightEvent[]) => void;
  onEvent: (event: FlightEvent) => void;
  onStatus?: (status: FlightConnectionStatus) => void;
  onError?: (error: FlightSubscribeError) => void;
};

function parseEvent(raw: FlightEventResponse): FlightEvent {
  return { ...raw, createdAt: new Date(raw.createdAt) } as FlightEvent;
}

export function subscribeToFlightEvents(flightId: string, listeners: FlightEventsListeners): () => void {
  let disposed = false;
  let reauthAttempts = 0;
  let reauthInFlight = false;

  const report = (message: string) => listeners.onError?.({ flightId, message });
  const setStatus = (status: FlightConnectionStatus) => listeners.onStatus?.(status);

  const socket: Socket = io(`${getFlightTrackerApiHost()}${FLIGHT_EVENTS_NAMESPACE}`, {
    auth: (cb) => cb({ token: readAccessToken() ?? "" }),
    transports: ["websocket"],
  });
  setStatus("connecting");

  const reauthenticate = async (): Promise<boolean> => {
    if (disposed || reauthInFlight || reauthAttempts >= MAX_REAUTH_ATTEMPTS) return false;
    reauthInFlight = true;
    reauthAttempts += 1;
    try {
      await refreshAccessToken();
      return true;
    } catch (error) {
      report(error instanceof Error ? error.message : "Token refresh failed");
      return false;
    } finally {
      reauthInFlight = false;
    }
  };

  socket.on("connect", () => {
    reauthAttempts = 0;
    setStatus("live");
    socket.emit("subscribe", { flightId });
  });
  socket.on("flight.events", (history: FlightEventResponse[]) => listeners.onHistory(history.map(parseEvent)));
  socket.on("flight.event", (event: FlightEventResponse) => listeners.onEvent(parseEvent(event)));
  socket.on("flight.subscribe.error", (error: FlightSubscribeError) => listeners.onError?.(error));

  socket.on("connect_error", (error: Error) => {
    report(`connection error: ${error.message}`);
    setStatus("reconnecting");
    if (socket.active) return;
    void reauthenticate().then((refreshed) => {
      if (disposed) return;
      if (refreshed) socket.connect();
      else setStatus("lost");
    });
  });

  socket.on("disconnect", (reason: string) => {
    if (disposed || reason === "io client disconnect") return;
    if (reason === "io server disconnect") {
      report("subscription closed by server");
      setStatus("lost");
      return;
    }
    report(`connection lost: ${reason}`);
    setStatus("reconnecting");
  });

  return () => {
    disposed = true;
    if (socket.connected) socket.emit("unsubscribe", { flightId });
    socket.removeAllListeners();
    socket.disconnect();
  };
}
