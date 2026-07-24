import { Button } from "flowbite-react";
import React from "react";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  name: string | null;
  onEdit?: () => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function RotationCaptainCard({ name, onEdit }: Props) {
  return (
    <Container padding="condensed">
      <div className="flex items-center gap-3">
        <span className="flex size-11 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
          {name ? initials(name) : "—"}
        </span>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-gray-900 dark:text-white">{name ?? "Unassigned"}</span>
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">Captain</span>
        </div>
        {onEdit && (
          <Button color="gray" outline size="sm" className="shrink-0" onClick={onEdit}>
            Change
          </Button>
        )}
      </div>
    </Container>
  );
}
