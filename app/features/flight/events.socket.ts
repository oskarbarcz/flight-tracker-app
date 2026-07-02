import { io, type Socket } from "socket.io-client";
import type { FlightEvent } from "~/models";
import { getFlightTrackerApiHost } from "~/shared/lib/getFlightTrackerApiHost";
import { readAccessToken } from "~/shared/lib/tokenStorage";

const FLIGHT_EVENTS_NAMESPACE = "/flight-events";

type FlightEventResponse = Omit<FlightEvent, "createdAt"> & { createdAt: string };

export type FlightSubscribeError = { flightId: string; message: string };

export type FlightEventsListeners = {
  onHistory: (events: FlightEvent[]) => void;
  onEvent: (event: FlightEvent) => void;
  onError?: (error: FlightSubscribeError) => void;
};

function parseEvent(raw: FlightEventResponse): FlightEvent {
  return { ...raw, createdAt: new Date(raw.createdAt) } as FlightEvent;
}

export function subscribeToFlightEvents(flightId: string, listeners: FlightEventsListeners): () => void {
  const socket: Socket = io(`${getFlightTrackerApiHost()}${FLIGHT_EVENTS_NAMESPACE}`, {
    auth: (cb) => cb({ token: readAccessToken() ?? "" }),
    transports: ["websocket"],
  });

  const subscribe = () => socket.emit("subscribe", { flightId });

  socket.on("connect", subscribe);
  socket.on("flight.events", (history: FlightEventResponse[]) => listeners.onHistory(history.map(parseEvent)));
  socket.on("flight.event", (event: FlightEventResponse) => listeners.onEvent(parseEvent(event)));
  socket.on("flight.subscribe.error", (error: FlightSubscribeError) => listeners.onError?.(error));

  return () => {
    if (socket.connected) socket.emit("unsubscribe", { flightId });
    socket.removeAllListeners();
    socket.disconnect();
  };
}
