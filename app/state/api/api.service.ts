import { getFlightTrackerApiHost } from "~/functions/getFlightTrackerApiHost";

export type BadRequestViolations<T> = Record<keyof T, string[]>;

export type ErrorResponse<T> = {
  error: string;
  message: string;
  violations?: BadRequestViolations<T>;
};

export abstract class AbstractApiService {
  protected host: string;

  constructor() {
    this.host = getFlightTrackerApiHost();
  }

  protected async doRequest(
    endpoint: string,
    options: RequestInit,
    token: string | undefined = undefined,
  ): Promise<Response> {
    return fetch(`${this.host}${endpoint}`, {
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
}

export abstract class AbstractAuthorizedApiService extends AbstractApiService {
  protected async requestWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const { data } = await this.requestWithAuthAndHeaders<T>(endpoint, options);
    return data;
  }

  protected async requestWithAuthAndHeaders<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; headers: Headers }> {
    let token = this.getAccessToken();
    let response = await super.doRequest(endpoint, options, token);

    if (response.status === 401) {
      token = await this.refreshAccessToken();
      response = await super.doRequest(endpoint, options, token);
    }

    if (response.status === 204) {
      return { data: "" as T, headers: response.headers };
    }

    if (response.status >= 400 && response.status < 500) {
      const errorResponse = (await response.json()) as ErrorResponse<T>;
      return Promise.reject(errorResponse);
    }

    const data = (await response.json()) as T;
    return { data, headers: response.headers };
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
    const response = await fetch(`${this.host}/api/v1/auth/refresh`, {
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
}
