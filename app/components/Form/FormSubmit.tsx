"use client";

import React from "react";
import Container from "~/components/Layout/Container";
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
  return (
    <Container padding="none">
      {message ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center font-bold text-sm text-red-500">
            <MdError className="inline mr-1" />
            {message}
          </div>
          <Button className="cursor-pointer" type="submit">
            {button}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end">
          <Button className="cursor-pointer" onClick={onSubmit}>
            {button}
          </Button>
        </div>
      )}
    </Container>
  );
}
