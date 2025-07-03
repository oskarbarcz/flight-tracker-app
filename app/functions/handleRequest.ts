import { ErrorResponse, BadRequestViolations } from "~/state/api/api.service";

export type ResponseWrapper<T> = {
  body: T | ErrorResponse<T>;
  redirectUrl?: string;
  isSuccessful: boolean;
  isError: boolean;
  oneGeneralError?: string;
  violations?: BadRequestViolations<T>;
};

export function handleRequestSuccess<T>(
  response: T,
  redirectUrl: string,
): ResponseWrapper<T> {
  return {
    body: response,
    redirectUrl: redirectUrl,
    isSuccessful: true,
    isError: false,
  };
}

export function handleRequestError<T>(
  response: ErrorResponse<T>,
): ResponseWrapper<T> {
  const hasViolations =
    response.violations && Object.keys(response.violations).length > 0;
  return {
    body: response,
    oneGeneralError: hasViolations ? undefined : response.error,
    violations: response.violations,
    isSuccessful: false,
    isError: true,
  };
}
