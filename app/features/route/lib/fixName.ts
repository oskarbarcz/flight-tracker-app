const PSEUDO_FIX_IDENT = /^(TOC|TOD|ETP\d*)$/;
const EQUAL_TIME_POINT_IDENT = /^ETP\d*$/;

export function isPseudoFix(ident: string): boolean {
  return PSEUDO_FIX_IDENT.test(ident);
}

export function isEqualTimePoint(ident: string): boolean {
  return EQUAL_TIME_POINT_IDENT.test(ident);
}

export function pseudoFixName(name: string): string {
  return `(${name})`;
}

export function fixName(ident: string): string {
  return isPseudoFix(ident) ? pseudoFixName(ident) : ident;
}
