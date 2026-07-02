import type { FormikErrors } from "formik";
import type { ErrorResponse } from "~/state/api/api.service";

export function handleFormikApiError<T extends object>(
  err: unknown,
  setErrors: (errors: FormikErrors<T>) => void,
  showError: (message: string) => void,
  fallbackMessage = "Request failed.",
): void {
  const response = err as ErrorResponse<T> | undefined;

  if (response?.violations && Object.keys(response.violations).length > 0) {
    const formikErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(response.violations)) {
      const list = messages as string[];
      if (list[0]) {
        formikErrors[field] = list[0];
      }
    }
    setErrors(formikErrors as FormikErrors<T>);
    return;
  }

  showError(response?.error ?? fallbackMessage);
}
