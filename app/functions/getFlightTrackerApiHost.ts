"use client";

export function getFlightTrackerApiHost() {
  const baseUrl = import.meta.env.VITE_FLIGHT_TRACKER_API_HOST;

  if (!baseUrl) {
    throw new Error("Flight Tracker host is not defined");
  }

  return baseUrl;
}

export function getAdsbApiHost() {
  const baseUrl = import.meta.env.VITE_ADSB_API_HOST;

  if (!baseUrl) {
    throw new Error("ADSB host is not defined");
  }

  return baseUrl as string;
}
