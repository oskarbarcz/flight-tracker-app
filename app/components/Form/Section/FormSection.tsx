"use client";

import React, { useState } from "react";
import Container from "~/components/Container";
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
          {editMode ? (
            <button
              className="cursor-pointer font-bold text-primary-500 px-4"
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
          ) : isSaved ? (
            <div className="flex items-center gap-1 px-4 text-green-500 font-bold">
              Saved <FaCheckCircle className="inline" />
            </div>
          ) : (
            <button
              className="cursor-pointer font-bold text-primary-500 px-4"
              type="button"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {children}
    </Container>
  );
}
