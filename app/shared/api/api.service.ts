import { getFlightTrackerApiHost } from "~/shared/lib/getFlightTrackerApiHost";
import { refreshAccessToken } from "~/shared/lib/refreshAccessToken";
import { isAccessTokenExpired, readAccessToken } from "~/shared/lib/tokenStorage";

export type BadRequestViolations<T> = Record<keyof T, string[]>;

export type ErrorResponse<T> = {
  error: string;
  message: string;
  statusCode?: number;
  violations?: BadRequestViolations<T>;
};

export abstract class AbstractApiService {
  protected host: string;

  constructor() {
    this.host = getFlightTrackerApiHost();
  }

  protected async doRequest(endpoint: string, options: RequestInit, token: string | undefined = undefined) {
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

  protected async request<T>(endpoint: string, options: RequestInit = {}) {
    const response = await this.doRequest(endpoint, options);

    if (response.status === 204) {
      return "" as T;
    }

    if (response.status >= 300) {
      const errorResponse = (await response
        .json()
        .catch(() => ({ error: response.statusText, message: response.statusText }))) as ErrorResponse<T>;
      return Promise.reject({ ...errorResponse, statusCode: response.status });
    }

    return (await response.json()) as T;
  }
}

export abstract class AbstractAuthorizedApiService extends AbstractApiService {
  protected async fetchWithAuth<T>(endpoint: string, options: RequestInit = {}) {
    const { data } = await this.requestWithAuthAndHeaders<T>(endpoint, options);
    return data;
  }

  protected async requestWithAuthAndHeaders<T>(endpoint: string, options: RequestInit = {}) {
    let token = this.getAccessToken();
    if (isAccessTokenExpired()) {
      token = await refreshAccessToken();
    }
    let response = await super.doRequest(endpoint, options, token);

    if (response.status === 401) {
      token = await refreshAccessToken();
      response = await super.doRequest(endpoint, options, token);
    }

    if (response.status === 204) {
      return { data: "" as T, headers: response.headers };
    }

    if (response.status >= 400 && response.status < 500) {
      const errorResponse = (await response.json()) as ErrorResponse<T>;
      return Promise.reject({ ...errorResponse, statusCode: response.status });
    }

    const data = (await response.json()) as T;
    return { data, headers: response.headers };
  }

  private getAccessToken() {
    const token = readAccessToken();
    if (token === null) {
      throw new Error("Unauthorized");
    }
    return token;
  }
}
