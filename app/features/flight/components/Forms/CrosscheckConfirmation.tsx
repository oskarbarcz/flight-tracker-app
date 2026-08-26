import React, { useRef, useState } from "react";
import { useAuth } from "~/app-state/useAuth";
import { AcceptanceStamp, StampInkBleedFilter } from "~/features/flight/components/Forms/AcceptanceStamp";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";

type Props = {
  id: string;
  confirmed: boolean;
  onConfirm: (confirmed: boolean) => void;
};

const STATEMENT = "I hereby confirm that numbers above are crosschecked, correct and valid for planned operation.";

export function CrosscheckConfirmation({ id, confirmed, onConfirm }: Props) {
  const { user } = useAuth();
  const [signedAt, setSignedAt] = useState<Date | null>(null);
  const pressed = useRef(false);

  const handleChange = (next: boolean) => {
    if (next) {
      pressed.current = !prefersReducedMotion();
      setSignedAt(new Date());
    } else {
      pressed.current = false;
      setSignedAt(null);
    }

    onConfirm(next);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 dark:border-gray-700 dark:bg-gray-800">
      <StampInkBleedFilter />

      <label
        htmlFor={id}
        className="group flex flex-1 cursor-pointer items-start gap-3 text-xs leading-relaxed text-gray-700 dark:text-gray-200"
      >
        <input
          id={id}
          type="checkbox"
          checked={confirmed}
          onChange={(event) => handleChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden={true}
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors group-hover:border-indigo-400 peer-checked:border-green-700 peer-checked:bg-green-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:peer-checked:border-green-400 dark:peer-checked:bg-green-400 dark:peer-focus-visible:ring-offset-gray-800"
        >
          <svg viewBox="0 0 16 16" className="size-3.5 text-white dark:text-gray-900" aria-hidden={true}>
            <title>Accepted</title>
            <path
              d="M3 8.5l3.2 3.2L13 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 transition-opacity peer-checked:opacity-100"
              style={{ opacity: confirmed ? 1 : 0 }}
            />
          </svg>
        </span>
        <span>{STATEMENT}</span>
      </label>

      <div
        className="acceptance-slot shrink-0 self-center"
        style={confirmed ? { borderColor: "transparent" } : undefined}
      >
        {confirmed && signedAt !== null ? (
          <AcceptanceStamp signedAt={signedAt} licenceId={user?.pilotLicenseId ?? null} animate={pressed.current} />
        ) : (
          <span className="px-3 text-center text-[11px] font-bold uppercase leading-tight tracking-[0.08em] text-gray-400 dark:text-gray-500">
            Awaiting
            <br />
            commander's acceptance
          </span>
        )}
      </div>
    </div>
  );
}
