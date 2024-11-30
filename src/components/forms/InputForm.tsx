"use client";

import { Input } from "@nextui-org/react";

interface InputFormProps {
  type: string;
  label: string;
  defaultValue: string;
  labelColor?: string;
  variant?: "bordered" | "faded";
}

export default function InputForm({ type, label, defaultValue, labelColor="text-black", variant="faded" }: InputFormProps) {
  return (
    <Input
      isReadOnly
      type={type}
      label={label}
      defaultValue={defaultValue}
      className="max-w-xs"
      variant={variant}
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined,
      }}
    />
  );
}