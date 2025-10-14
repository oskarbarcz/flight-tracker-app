"use client";

import React from "react";

type FormSectionEditProps = {
  title: string;
  onClick: () => void;
};

export default function FormSectionEdit({
  title,
  onClick,
}: FormSectionEditProps) {
  return (
    <button
      className="cursor-pointer font-bold text-indigo-500 px-4"
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
