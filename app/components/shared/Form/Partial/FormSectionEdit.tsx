"use client";

import React from "react";

type Props = {
  title: string;
  onClick: () => void;
};

export function FormSectionEdit({ title, onClick }: Props) {
  return (
    <button className="cursor-pointer font-bold text-indigo-500 px-4" type="button" onClick={onClick}>
      {title}
    </button>
  );
}
