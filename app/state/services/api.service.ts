import { getApiBaseUrl } from "~/functions/getApiBaseUrl";

export abstract class AbstractApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  protected getAccessToken(): string {
    const token: string | null = localStorage.getItem("at");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return token;
  }

  protected getRefreshToken(): string {
    const refreshToken = localStorage.getItem("rt");

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    return refreshToken;
  }

  protected saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("at", accessToken);
    localStorage.setItem("rt", refreshToken);
  }

  protected async refreshAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getRefreshToken()}`,
      },
    });

    if (!response.ok) {
      this.handleUnauthorized();
      throw new Error("Failed to refresh access token");
    }

    const { accessToken, refreshToken } = await response.json();
    this.saveTokens(accessToken, refreshToken);

    return accessToken;
  }

  protected async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    let token = this.getAccessToken();

    const makeRequest = async (): Promise<Response> => {
      return fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    };

    let response = await makeRequest();

    if (response.status === 401) {
      try {
        token = await this.refreshAccessToken();
        response = await makeRequest();
      } catch {
        this.handleUnauthorized();
        throw new Error("Unauthorized");
      }
    }

    if (response.status === 204) {
      return "" as T;
    }

    return (await response.json()) as T;
  }

  protected handleUnauthorized(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}
