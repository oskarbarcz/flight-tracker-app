import { ErrorResponse, BadRequestViolations } from "~/state/api/api.service";

type SuccessResponseWrapper<ResponseDto> = {
  body: ResponseDto;
  redirectUrl: string;
  isSuccessful: true;
  isError: false;
};

type ErrorResponseWrapper<RequestDto> = {
  body: ErrorResponse<RequestDto>;
  isSuccessful: false;
  isError: true;
  oneGeneralError?: string;
  violations?: BadRequestViolations<RequestDto>;
  errorsForKey: (fieldName: keyof RequestDto) => string[];
};

export type ResponseWrapper<RequestDto, ResponseDto> =
  | SuccessResponseWrapper<ResponseDto>
  | ErrorResponseWrapper<RequestDto>;

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function handleRequestSuccess<ResponseDto>(
  response: ResponseDto,
  redirectUrl: string,
): SuccessResponseWrapper<ResponseDto> {
  return {
    body: response,
    redirectUrl: redirectUrl,
    isSuccessful: true,
    isError: false,
  };
}

export function handleRequestError<RequestDto>(
  response: ErrorResponse<RequestDto>,
): ErrorResponseWrapper<RequestDto> {
  const hasViolations =
    response.violations && Object.keys(response.violations).length > 0;

  return {
    body: response,
    oneGeneralError: hasViolations ? undefined : response.error,
    violations: response.violations,
    errorsForKey: (fieldName: keyof RequestDto): string[] => {
      return hasViolations
        ? (response.violations?.[fieldName].map(
            capitalizeFirstLetter,
          ) as string[])
        : [];
    },
    isSuccessful: false,
    isError: true,
  };
}
