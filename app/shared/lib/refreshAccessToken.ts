import { getFlightTrackerApiHost } from "~/shared/lib/getFlightTrackerApiHost";
import { clearTokens, readRefreshToken, saveTokens } from "~/shared/lib/tokenStorage";

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = readRefreshToken();
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await fetch(`${getFlightTrackerApiHost()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    clearTokens();
    window.location.replace("/sign-in");
    throw new Error("Failed to refresh access token");
  }

  const { accessToken, refreshToken: rotatedRefreshToken } = await response.json();
  saveTokens(accessToken, rotatedRefreshToken);

  return accessToken as string;
}
