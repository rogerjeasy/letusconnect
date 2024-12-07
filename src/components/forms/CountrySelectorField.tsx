"use client";

import SelectCountry from "../forms/SelectCountry";
import InputForm from "../forms/InputForm";
import { UseFormSetValue } from "react-hook-form";

// Full form schema type
interface FormValues {
  company: string;
  position: string;
  country: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  responsibilities?: string[];
  achievements?: string[];
}

interface CountrySelectorFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  handleFieldChange: (value: string) => void;
  setSelectedCountry: (country: string) => void;
  setValue?: UseFormSetValue<FormValues>;
  fieldValue?: keyof FormValues;
  error?: string;
}

export default function CountrySelectorField({
  label,
  value,
  isEditing,
  handleFieldChange,
  setSelectedCountry,
  setValue,
  fieldValue = "country",
  error,
}: CountrySelectorFieldProps) {
  return isEditing ? (
    <>
      <SelectCountry
        selectionMode="country"
        defaultValue={value}
        onChange={(selectedValue) => {
          const countryValue = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
          handleFieldChange(countryValue);
          setSelectedCountry(countryValue);
          if (setValue && fieldValue) {
            setValue(fieldValue, countryValue);
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