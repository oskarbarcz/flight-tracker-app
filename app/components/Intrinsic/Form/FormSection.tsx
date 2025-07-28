"use client";

import React, { useState } from "react";
import Container from "~/components/Container";
import { Button } from "flowbite-react";
import { FaCheckCircle } from "react-icons/fa";

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

export default function FormSection({
  title,
  editMode,
  setEditMode,
  children,
}: FormSectionProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleEdit = () => {
    setEditMode(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setEditMode(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Container>
      <div className="mb-4 flex justify-between align-center">
        <h3 className="font-bold text-2xl">{title}</h3>
        <div className="flex gap-6 items-center">
          {isSaved && (
            <div className="flex items-center gap-1 text-green-500 font-bold text-sm">
              Saved <FaCheckCircle className="inline" />
            </div>
          )}
          {editMode ? (
            <Button
              className="cursor-pointer"
              type="button"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          ) : (
            <Button
              className="cursor-pointer"
              type="button"
              size="sm"
              outline
              onClick={handleEdit}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      {children}
    </Container>
  );
}
