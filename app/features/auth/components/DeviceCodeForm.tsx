import { Button } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { CredentialField } from "~/features/auth/components/CredentialField";
import { formatUserCode, normalizeUserCode } from "~/features/auth/lib/deviceUserCode";

type Props = {
  onSubmit: (userCode: string) => void;
};

const missingCodeMessage = "Enter the code to continue.";
const errorId = "device-code-error";

export function DeviceCodeForm({ onSubmit }: Props) {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalized = normalizeUserCode(code);

    if (normalized === null) {
      setError(missingCodeMessage);
      codeRef.current?.focus();
      return;
    }

    setError(null);
    onSubmit(formatUserCode(normalized));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">Enter the code shown in the Transponder.</p>

      <CredentialField
        id="device-code"
        label="Code"
        type="text"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={code}
        errorId={error === null ? undefined : errorId}
        inputRef={codeRef}
        onChange={setCode}
      />

      {error !== null && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
        >
          <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <Button type="submit" color="indigo" className="min-h-11 w-full font-bold">
        Continue
      </Button>
    </form>
  );
}
