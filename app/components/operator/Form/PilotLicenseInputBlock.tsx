"use client";

import { Label, TextInput } from "flowbite-react";
import { FormikErrors } from "formik";
import React, { useEffect, useState } from "react";
import PilotInputPreview from "~/components/operator/Form/Preview/PilotInputPreview";
import InputErrorList from "~/components/shared/Form/InputErrorList";
import { GetUserResponse } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type PilotLicenseInputBlockProps = {
  htmlName: string;
  label: string;
  defaultValue?: string | undefined;
  errors: string[];
  setFieldValue?: (
    field: string,
    value: string,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<unknown>>;
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
  setFieldValue,
}: PilotLicenseInputBlockProps) {
  const { userService } = useApi();

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
      if (setFieldValue) {
        setFieldValue(htmlName, user.id);
      }
    });
  }, [defaultValue, userService, htmlName, setFieldValue]);

  useEffect(() => {
    setErrors(parentErrors);
  }, [parentErrors]);

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPilotLicenseId(value);
    setPilot(null);
    setPilotId("");
    if (setFieldValue) {
      setFieldValue(htmlName, "");
    }

    if (value && value.length !== 8) {
      setErrors([]);
      return;
    }

    userService
      .getUserByLicenseId(value)
      .then((user) => {
        setPilot(user);
        setPilotId(user.id);
        if (setFieldValue) {
          setFieldValue(htmlName, user.id);
        }
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
        <Label htmlFor={htmlName}>{label}</Label>
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
            if (setFieldValue) {
              setFieldValue(htmlName, "");
            }
          }}
        />
      )}
    </div>
  );
}
