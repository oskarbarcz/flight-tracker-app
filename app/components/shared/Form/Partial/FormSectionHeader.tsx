import React from "react";
import type { IconType } from "react-icons";
import { FormSectionEdit } from "~/components/shared/Form/Partial/FormSectionEdit";
import { FormSectionSave } from "~/components/shared/Form/Partial/FormSectionSave";
import { FormSectionSaveConfirmation } from "~/components/shared/Form/Partial/FormSectionSaveConfirmation";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

type Props = {
  icon: IconType;
  title: string;
  description?: string;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  showSaveConfirmation: boolean;
};

export function FormSectionHeader({ icon, title, description, edit, setEdit, showSaveConfirmation }: Props) {
  let actions: React.JSX.Element;
  if (edit) {
    actions = <FormSectionSave title="Save" />;
  } else if (showSaveConfirmation) {
    actions = <FormSectionSaveConfirmation />;
  } else {
    actions = <FormSectionEdit title="Edit" onClick={() => setEdit(true)} />;
  }

  return <ContainerTitle icon={icon} title={title} description={description} actions={actions} />;
}
