"use client";

import { Input } from "@nextui-org/react";

interface InputFormProps {
  type: string;
  label: string;
  value: string;
  labelColor?: string;
  variant?: "bordered" | "faded";
}

export default function InputForm({ type, label, value, labelColor = "text-black", variant = "faded" }: InputFormProps) {
  return (
    <Input
      isReadOnly
      type={type}
      label={label}
      value={value}
      className="max-w-xs"
      variant={variant}
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined,
      }}
    />
  );
}