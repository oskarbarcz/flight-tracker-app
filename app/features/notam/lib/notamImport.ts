import type { Notam } from "~/features/notam/model";

export function notamsImportedAt(notams: Notam[] | null): string | null {
  return notams && notams.length > 0 ? notams[0].dateImported : null;
}
