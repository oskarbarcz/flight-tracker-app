"use client";

import React from "react";
import FormSectionEdit from "~/components/shared/Form/Partial/FormSectionEdit";
import FormSectionSave from "~/components/shared/Form/Partial/FormSectionSave";
import FormSectionSaveConfirmation from "~/components/shared/Form/Partial/FormSectionSaveConfirmation";

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
