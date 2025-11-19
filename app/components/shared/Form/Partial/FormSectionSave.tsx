"use client";

import React from "react";

type FormSectionEditProps = {
  title: string;
};

export default function FormSectionSave({ title }: FormSectionEditProps) {
  return (
    <button
      className="cursor-pointer font-bold text-indigo-500 px-4"
      type="submit"
    >
      {title}
    </button>
  );
}
