"use client";

export function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  return baseUrl;
}
