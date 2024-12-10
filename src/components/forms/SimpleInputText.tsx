"use client";

import { Input } from "@nextui-org/react";
import { ReactNode } from "react";

interface SimpleInputTextProps {
  placeholder: string;
  icon: ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
  type?: string;
  register: any; // The register function from react-hook-form
}

export default function SimpleInputText({
  placeholder,
  icon,
  isInvalid = false,
  errorMessage,
  type = "text",
  register,
}: SimpleInputTextProps) {
  return (
    <Input
      {...register}
      type={type}
      placeholder={placeholder}
      startContent={icon}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      fullWidth
      style={{ caretColor: "black" }}
    />
  );
}
