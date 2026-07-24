import { FloatingLabel } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import type { GetUserResponse } from "~/features/user/request";
import { useApi } from "~/shared/api/useApi";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";

type Props = {
  htmlName: string;
  label: string;
  defaultValue?: string;
  errors?: string[];
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
};

function errorToMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const statusCode = (error as { statusCode: number }).statusCode;
    if (statusCode === 400) {
      return "Pilot license ID format is incorrect";
    }
  }
  if (Array.isArray(error) && error.length === 0) {
    return "Pilot with given license ID not found";
  }
  return "An unexpected error occurred while fetching pilot data";
}

export function PilotLicenseInputBlock({
  htmlName,
  label,
  defaultValue,
  errors: parentErrors = [],
  setFieldValue,
}: Props) {
  const { userService } = useApi();
  const [pilot, setPilot] = useState<GetUserResponse | null>(null);
  const [pilotLicenseId, setPilotLicenseId] = useState("");
  const [errors, setErrors] = useState<string[]>(parentErrors);

  useEffect(() => {
    if (!defaultValue) {
      return;
    }
    userService.fetchUserById(defaultValue).then((user) => {
      setPilot(user);
      setPilotLicenseId(user.pilotLicenseId ?? "");
      setFieldValue(htmlName, user.id);
    });
  }, [defaultValue, userService, htmlName, setFieldValue]);

  useEffect(() => {
    setErrors(parentErrors);
  }, [parentErrors]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setPilotLicenseId(value);
    setPilot(null);
    setErrors([]);
    setFieldValue(htmlName, "");

    if (value.length !== 8) {
      return;
    }

    userService
      .fetchUserByLicenseId(value)
      .then((user) => {
        setPilot(user);
        setFieldValue(htmlName, user.id);
      })
      .catch((fetchError) => setErrors([errorToMessage(fetchError)]));
  };

  const clear = () => {
    setPilot(null);
    setPilotLicenseId("");
    setFieldValue(htmlName, "");
  };

  return (
    <div>
      <FloatingLabel
        variant="outlined"
        id="pilotLicenseId"
        name="pilotLicenseId"
        label={label}
        maxLength={8}
        value={pilotLicenseId}
        onChange={onInputChange}
        color={errors.length > 0 ? "error" : undefined}
      />
      <InputErrorList errors={errors} errorFocus={errors.length > 0} />
      {pilot && (
        <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/60">
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{pilot.name}</span>
            <span className="block text-xs text-gray-500">License: {pilot.pilotLicenseId}</span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear selected pilot"
          >
            <FaXmark />
          </button>
        </div>
      )}
    </div>
  );
}
