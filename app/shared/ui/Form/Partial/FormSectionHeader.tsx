import React from "react";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { FormSectionEdit } from "~/shared/ui/Form/Partial/FormSectionEdit";
import { FormSectionSave } from "~/shared/ui/Form/Partial/FormSectionSave";
import { FormSectionSaveConfirmation } from "~/shared/ui/Form/Partial/FormSectionSaveConfirmation";

type Props = {
  title: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  showSaveConfirmation: boolean;
};

export function FormSectionHeader({ title, edit, setEdit, showSaveConfirmation }: Props) {
  let actions: React.JSX.Element;
  if (edit) {
    actions = <FormSectionSave title="Save" />;
  } else if (showSaveConfirmation) {
    actions = <FormSectionSaveConfirmation />;
  } else {
    actions = <FormSectionEdit title="Edit" onClick={() => setEdit(true)} />;
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <FormSectionLabel>{title}</FormSectionLabel>
      <div className="shrink-0">{actions}</div>
    </div>
  );
}
