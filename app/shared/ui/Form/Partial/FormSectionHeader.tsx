import React from "react";
import type { IconType } from "react-icons";
import { FormSectionEdit } from "~/shared/ui/Form/Partial/FormSectionEdit";
import { FormSectionSave } from "~/shared/ui/Form/Partial/FormSectionSave";
import { FormSectionSaveConfirmation } from "~/shared/ui/Form/Partial/FormSectionSaveConfirmation";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  icon: IconType;
  title: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  showSaveConfirmation: boolean;
};

export function FormSectionHeader({ icon, title, edit, setEdit, showSaveConfirmation }: Props) {
  let actions: React.JSX.Element;
  if (edit) {
    actions = <FormSectionSave title="Save" />;
  } else if (showSaveConfirmation) {
    actions = <FormSectionSaveConfirmation />;
  } else {
    actions = <FormSectionEdit title="Edit" onClick={() => setEdit(true)} />;
  }

  return <ContainerTitle icon={icon} title={title} actions={actions} />;
}
