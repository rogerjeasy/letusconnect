"use client";

import { Input } from "@nextui-org/react";

interface InputToUpdateProps {
  type: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  labelColor?: string;
  variant?: "bordered" | "faded";
  onChange: (value: string) => void;
}

export default function InputToUpdate({
  type,
  label,
  placeholder,
  defaultValue,
  labelColor = "text-black",
  variant = "faded",
  onChange,
}: InputToUpdateProps) {
  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="max-w-xs"
      variant={variant}
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined
      }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}