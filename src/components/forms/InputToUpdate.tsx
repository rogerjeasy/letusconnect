"use client";

import { Input } from "@nextui-org/react";

interface InputToUpdateProps<T = string> {
  type: string;
  label: string;
  placeholder: string;
  value: T; // Generic type for value
  labelColor?: string;
  variant?: "bordered" | "faded";
  onChange: (value: T) => void;
}

export default function InputToUpdate<T>({
  type,
  label,
  placeholder,
  value,
  labelColor = "text-black",
  variant = "faded",
  onChange,
}: InputToUpdateProps<T>) {
  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      value={value as string}
      className="max-w-xs"
      variant={variant}
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined,
      }}
      onChange={(e) => onChange(e.target.value as T)}
    />
  );
}