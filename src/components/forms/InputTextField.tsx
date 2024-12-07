"use client";

import InputToUpdate from "../forms/InputToUpdate";
import InputForm from "../forms/InputForm";
import { UseFormSetValue } from "react-hook-form";

interface FieldNameProps {
  label: string;
  value: string;
  isEditing: boolean;
  error?: string;
  setValue?: UseFormSetValue<{ company: string; position: string; country: string; startDate?: Date; endDate?: Date; responsibilities?: string[]; achievements?: string[]; city?: string }>;
  fieldValue?: "company" | "position" | "country" | "city";
}

export default function FieldName({ label, value, isEditing, error, setValue, fieldValue }: FieldNameProps) {
  return isEditing ? (
    <>
      <InputToUpdate
        type="text"
        label={label}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={(newValue) => {
          if (setValue && fieldValue) {
            setValue(fieldValue, newValue);
          }
        }}
      />
      {error && (
        <p className="text-red-500 text-xs italic mt-1">
          {error}
        </p>
      )}
    </>
  ) : (
    <InputForm type="text" label={label} value={value} />
  );
}