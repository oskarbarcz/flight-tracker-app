"use client";

import React, { useEffect, useState } from "react";
import { GetUserResponse } from "~/models";
import { Label, TextInput } from "flowbite-react";
import { useUserService } from "~/state/hooks/api/useUserService";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";
import PilotInputPreview from "~/components/Form/Section/PilotInputPreview";

type PilotLicenseInputBlockProps = {
  htmlName: string;
  label: string;
  defaultValue?: string | undefined;
  errors: string[];
};

const errorToMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const errorObj = error as { statusCode: number };
    if (errorObj.statusCode === 400) {
      return "Pilot license ID format is incorrect";
    }
  }

  if (Array.isArray(error) && error.length === 0) {
    return "Pilot with given license ID not found";
  }

  return "An unexpected error occurred while fetching pilot data";
};

export default function PilotLicenseInputBlock({
  htmlName,
  label,
  errors: parentErrors,
  defaultValue,
}: PilotLicenseInputBlockProps) {
  const userService = useUserService();

  const [pilot, setPilot] = useState<GetUserResponse | null>(null);
  const [pilotId, setPilotId] = useState<string | undefined>(defaultValue);
  const [pilotLicenseId, setPilotLicenseId] = useState<string>("");
  const [errors, setErrors] = useState<string[]>(parentErrors);

  useEffect(() => {
    if (!defaultValue) {
      return;
    }

    userService.getUserById(defaultValue).then((user) => {
      setPilot(user);
      setPilotId(user.id);
      setPilotLicenseId(user.pilotLicenseId);
    });
  }, [defaultValue, userService]);

  useEffect(() => {
    setErrors(parentErrors);
  }, [parentErrors]);

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPilotLicenseId(value);
    setPilot(null);
    setPilotId("");

    if (value && value.length !== 8) {
      setErrors([]);
      return;
    }

    userService
      .getUserByLicenseId(value)
      .then((user) => {
        setPilot(user);
        setPilotId(user.id);
      })
      .catch((newError) =>
        setErrors((currentErrors) => [
          ...currentErrors,
          errorToMessage(newError),
        ]),
      );
  };

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName} value={label} />
      </div>
      <TextInput
        id={htmlName}
        name={htmlName}
        defaultValue={pilotId}
        className="hidden"
      />
      <TextInput
        name="pilotLicenseId"
        maxLength={8}
        value={pilotLicenseId}
        onChange={onInputChange}
      />
      <InputErrorList errors={errors} errorFocus={true} />
      {pilot && (
        <PilotInputPreview
          user={pilot}
          onClose={() => {
            setPilotLicenseId("");
            setPilotId(undefined);
            setPilot(null);
          }}
        />
      )}
    </div>
  );
}
