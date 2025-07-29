"use client";

import React from "react";
import FormSectionSave from "~/components/Form/Partial/FormSectionSave";
import FormSectionEdit from "~/components/Form/Partial/FormSectionEdit";
import FormSectionSaveConfirmation from "~/components/Form/Partial/FormSectionSaveConfirmation";

type FormSectionHeaderProps = {
  title: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  showSaveConfirmation: boolean;
};

export default function FormSectionHeader({
  title,
  edit,
  setEdit,
  showSaveConfirmation,
}: FormSectionHeaderProps) {
  let component: React.JSX.Element;
  if (edit) {
    component = <FormSectionSave title="Save" />;
  } else if (showSaveConfirmation) {
    component = <FormSectionSaveConfirmation />;
  } else {
    component = <FormSectionEdit title="Edit" onClick={() => setEdit(true)} />;
  }

  return (
    <div className="mb-4 flex justify-between align-center">
      <h3 className="font-bold text-2xl">{title}</h3>
      <div className="flex gap-6 items-center">{component}</div>
    </div>
  );
}
