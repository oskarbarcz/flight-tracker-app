"use client";

import React from "react";
import Container from "~/components/Container";
import { Button } from "flowbite-react";

type FormSubmitProps = {
  message?: string;
  button: string;
};

export default function FormSubmit({ message = "", button }: FormSubmitProps) {
  return (
    <Container invisible>
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-500">{message}</span>
        <Button className="cursor-pointer" type="submit">
          {button}
        </Button>
      </div>
    </Container>
  );
}
