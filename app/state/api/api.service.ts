import { getApiBaseUrl } from "~/functions/getApiBaseUrl";

export type BadRequestViolations<T> = Record<keyof T, string[]>;

export type ErrorResponse<T> = {
  error: string;
  message: string;
  violations?: BadRequestViolations<T>;
};

export abstract class AbstractApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private getAccessToken(): string {
    const token: string | null = localStorage.getItem("at");

    if (token === null) {
      throw new Error("Unauthorized");
    }

    return token;
  }

  private getRefreshToken(): string {
    const refreshToken = localStorage.getItem("rt");

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    return refreshToken;
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("at", accessToken);
    localStorage.setItem("rt", refreshToken);
  }

  private async refreshAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getRefreshToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const { accessToken, refreshToken } = await response.json();
    this.saveTokens(accessToken, refreshToken);

    return accessToken;
  }

  private async doRequest(
    endpoint: string,
    options: RequestInit,
    token: string | undefined = undefined,
  ): Promise<Response> {
    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await this.doRequest(endpoint, options);

    if (response.status === 204) {
      return "" as T;
    }

    if (response.status >= 300) {
      return Promise.reject(response.body);
    }

    return (await response.json()) as T;
  }

  protected async requestWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    let token = this.getAccessToken();
    let response = await this.doRequest(endpoint, options, token);

    if (response.status === 401) {
      token = await this.refreshAccessToken();
      response = await this.doRequest(endpoint, options, token);
    }

    if (response.status === 204) {
      return "" as T;
    }

    if (response.status >= 400 && response.status < 500) {
      const errorResponse = (await response.json()) as ErrorResponse<T>;
      return Promise.reject(errorResponse);
    }

    return (await response.json()) as T;
  }
}
