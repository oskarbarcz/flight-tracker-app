"use client";

import React from "react";
import { Button } from "flowbite-react";
import { MdError } from "react-icons/md";

type FormSubmitProps = {
  message: string | null;
  button: string;
  onSubmit: () => void;
};

export default function FormSubmit({
  message,
  button,
  onSubmit,
}: FormSubmitProps) {
  if (!message) {
    return (
      <div className="flex items-center justify-end py-3 px-6">
        <Button className="cursor-pointer" onClick={onSubmit}>
          {button}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-6">
      <div className="flex items-center font-bold text-sm text-red-500">
        <MdError className="inline mr-1" />
        {message}
      </div>
      <Button
        disabled={Boolean(message)}
        className="cursor-pointer"
        type="submit"
      >
        {button}
      </Button>
    </div>
  );
}
