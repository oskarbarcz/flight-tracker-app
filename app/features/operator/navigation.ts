const OPERATOR_EDIT_PARAM = "edit";
const OPERATOR_EDIT_VALUE = "operator";

export function operatorEditPath(pathname: string): string {
  return `${pathname}?${OPERATOR_EDIT_PARAM}=${OPERATOR_EDIT_VALUE}`;
}

export function isOperatorEditRequested(searchParams: URLSearchParams): boolean {
  return searchParams.get(OPERATOR_EDIT_PARAM) === OPERATOR_EDIT_VALUE;
}
