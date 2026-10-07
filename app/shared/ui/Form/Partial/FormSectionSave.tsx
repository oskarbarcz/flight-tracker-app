import React from "react";

type Props = {
  title: string;
};

export function FormSectionSave({ title }: Props) {
  return (
    <button className="cursor-pointer font-bold text-indigo-600 dark:text-indigo-400 px-4" type="submit">
      {title}
    </button>
  );
}
