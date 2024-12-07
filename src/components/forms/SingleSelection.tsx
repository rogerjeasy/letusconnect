"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface DropdownOption {
  key: string;
  label: string;
}

interface GeneralizedSelectProps {
  options: DropdownOption[];
  label: string;
  placeholder: string;
  className?: string;
  onChange?: (selectedKey: string) => void;
}

const SingleDropdownSelection: React.FC<GeneralizedSelectProps> = ({
  options,
  label,
  placeholder,
  className = "font-bold",
  onChange,
}) => {
  const handleSelectionChange = (keys: unknown) => {
    let selectedKey: string | undefined;

    if (keys instanceof Set) {
      // If keys is a Set, get the first value
      selectedKey = [...keys][0];
    } else if (typeof keys === "object" && keys !== null && "currentKey" in keys) {
      // Handle SharedSelection case (NextUI-specific)
      selectedKey = (keys as { currentKey?: string }).currentKey;
    }

    if (selectedKey && onChange) {
      onChange(selectedKey); // Pass the key to the parent component
    }
  };

  return (
    <Select
      items={options}
      label={label}
      placeholder={placeholder}
      className={className}
      onSelectionChange={handleSelectionChange}
    >
      {(option) => <SelectItem key={option.key}>{option.label}</SelectItem>}
    </Select>
  );
};

export default SingleDropdownSelection;


