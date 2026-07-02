import type { BadRequestViolations, ErrorResponse } from "~/state/api/api.service";

type ActionSuccess<ResponseDto> = {
  body: ResponseDto;
  isSuccessful: true;
  isError: false;
};

type ActionError<RequestDto = unknown> = {
  body: ErrorResponse<RequestDto>;
  isSuccessful: false;
  isError: true;
  oneGeneralError?: string;
  violations?: BadRequestViolations<RequestDto>;
  errorsForKey: (fieldName: string) => string[];
};

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function errorForKey<T>(response: ErrorResponse<T>, fieldName: keyof T): string[] {
  if (!response.violations) {
    return [];
  }
  if (!response.violations[fieldName]) {
    return [];
  }

  return response.violations[fieldName].map(capitalizeFirstLetter);
}

export function handleRequestSuccess<T>(response: T): ActionSuccess<T> {
  return {
    body: response,
    isSuccessful: true,
    isError: false,
  };
}

export function handleRequestError<T = unknown>(response: ErrorResponse<T> | unknown): ActionError<T> {
  const errorResponse = response as ErrorResponse<T>;
  const hasViolations = errorResponse.violations && Object.keys(errorResponse.violations).length > 0;
  return {
    body: errorResponse,
    oneGeneralError: hasViolations ? undefined : errorResponse.error,
    violations: errorResponse.violations,
    errorsForKey: (key: string) => errorForKey<T>(errorResponse, key as keyof T),
    isSuccessful: false,
    isError: true,
  };
}
