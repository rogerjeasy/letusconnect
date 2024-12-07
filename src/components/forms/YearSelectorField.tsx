"use client";

import { useFormContext } from "react-hook-form";
import YearSelector from "../forms/YearSelector";
import InputForm from "../forms/InputForm";

interface YearSelectorFieldProps {
  label: string;
  fieldName: string;
  value: number | string;
  isEditing: boolean;
  startYear?: number;
  endYear?: number;
  handleFieldChange: (value: number) => void;
  error?: string;
}

export default function YearSelectorField({
  label,
  fieldName,
  value,
  isEditing,
  startYear = 1950,
  endYear = new Date().getFullYear(),
  handleFieldChange,
  error,
}: YearSelectorFieldProps) {
  const { setValue } = useFormContext();

  return isEditing ? (
    <>
      <YearSelector
        startYear={startYear}
        endYear={endYear}
        label={label}
        placeholder={`Select a ${label.toLowerCase()}`}
        value={value?.toString()}
        onChange={(selectedYear) => {
          const yearAsNumber = Number(selectedYear);
          if (!isNaN(yearAsNumber)) {
            handleFieldChange(yearAsNumber);
            setValue(fieldName, yearAsNumber);
          } else {
            console.warn("Invalid year selected:", selectedYear);
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
    <InputForm
      type="text"
      label={label}
      value={value?.toString()}
    />
  );
}