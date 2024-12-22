// InputToUpdate.tsx
"use client";

import React from "react";
import { Input } from "@nextui-org/react";

interface InputToUpdateProps<T = string> {
  type: string;
  label: string;
  placeholder: string;
  value: T; // Generic type for value
  labelColor?: string;
  variant?: "bordered" | "faded";
  width?: string;
  onChange: (value: T) => void;
  isInvalid?: boolean;      
  errorMessage?: string; 
}

export default function InputToUpdate<T>({
  type,
  label,
  placeholder,
  value,
  labelColor = "text-black",
  variant = "faded",
  width = "max-w-xs",
  onChange,
  isInvalid = false,
  errorMessage = "",
}: InputToUpdateProps<T>) {
  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      value={value as string}
      className={width}
      variant={variant}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined,
      }}
      onChange={(e) => onChange(e.target.value as T)}
    />
  );
}