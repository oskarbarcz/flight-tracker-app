"use client";

import React, { useEffect, useState } from "react";
import Container from "~/components/Container";
import FormSectionHeader from "~/components/Form/Partial/FormSectionHeader";

type FormSectionProps = {
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
};

export default function FormSection({
  isEditable,
  setIsEditable,
  title,
  onSubmit,
  children,
}: FormSectionProps) {
  const [, setAllowEdit] = useState<boolean>(isEditable);
  const [showSavedInfo, setShowSavedInfo] = useState<boolean>(false);

  useEffect(() => {
    setAllowEdit(isEditable);
  }, [isEditable]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsEditable(false);
    onSubmit();

    setShowSavedInfo(true);
    setTimeout(() => setShowSavedInfo(false), 3000);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormSectionHeader
          title={title}
          edit={isEditable}
          setEdit={setIsEditable}
          showSaveConfirmation={showSavedInfo}
        />
        {children}
      </form>
    </Container>
  );
}
