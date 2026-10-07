import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

function errorPaths(errors: unknown, prefix = ""): string[] {
  if (typeof errors === "string") {
    return [prefix];
  }

  if (errors === null || typeof errors !== "object") {
    return [];
  }

  return Object.entries(errors).flatMap(([key, nested]) => errorPaths(nested, prefix ? `${prefix}.${key}` : key));
}

function findField(path: string): HTMLElement | null {
  const element = document.getElementById(path) ?? document.getElementsByName(path).item(0);

  return element instanceof HTMLElement ? element : null;
}

function byDocumentOrder(a: Node, b: Node): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

export function FocusFirstError() {
  const { errors, submitCount, isSubmitting, isValidating } = useFormikContext();
  const handledSubmitCount = useRef(submitCount);

  useEffect(() => {
    if (submitCount === handledSubmitCount.current || isSubmitting || isValidating) {
      return;
    }

    handledSubmitCount.current = submitCount;

    const [firstInvalidField] = errorPaths(errors)
      .map(findField)
      .filter((field) => field !== null)
      .sort(byDocumentOrder);

    firstInvalidField?.focus();
  }, [errors, submitCount, isSubmitting, isValidating]);

  return null;
}
