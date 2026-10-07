import { Button } from "flowbite-react";
import React from "react";
import { MdError } from "react-icons/md";

type Props = {
  message?: string;
  error?: string;
  button: string;
  onSubmit: () => void;
};

export function FormSubmit({ message, error, button, onSubmit }: Props) {
  if (!error && !message) {
    return (
      <div className="flex items-center justify-end py-3 px-6">
        <Button size="sm" color="indigo" onClick={onSubmit}>
          {button}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-6">
      {error && (
        <div role="alert" className="flex items-center font-bold text-sm text-red-700 dark:text-red-400">
          <MdError className="inline mr-1" />
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="flex items-center font-bold text-sm text-gray-500 dark:text-gray-400">
          <MdError className="inline mr-1" />
          {message}
        </div>
      )}

      {message ? (
        <Button size="sm" disabled color="indigo" className="cursor-not-allowed" type="submit">
          {button}
        </Button>
      ) : (
        <Button size="sm" color="indigo" onClick={onSubmit}>
          {button}
        </Button>
      )}
    </div>
  );
}
