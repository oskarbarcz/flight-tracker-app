import React from "react";
import { type Notam, notamsImportedAt } from "~/features/notam";
import { LastLoadedAt } from "~/shared/ui/Date/LastLoadedAt";

type Props = {
  notams: Notam[] | null;
};

export function NotamsImportedAt({ notams }: Props) {
  const importedAt = notamsImportedAt(notams);
  if (importedAt === null) return null;

  return <LastLoadedAt at={importedAt} label="Imported" />;
}
