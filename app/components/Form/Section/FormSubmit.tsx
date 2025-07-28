"use client";

import React from "react";
import Container from "~/components/Container";
import { Button } from "flowbite-react";
import { MdError } from "react-icons/md";

type FormSubmitProps = {
  message: string | null;
  button: string;
};

export default function FormSubmit({ message, button }: FormSubmitProps) {
  return (
    <Container invisible>
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
          <Button className="cursor-pointer" type="submit">
            {button}
          </Button>
        </div>
      )}
    </Container>
  );
}
