import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import React from "react";

interface CheckBoxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string[];
  orientation?: "horizontal" | "vertical";
  color?: "success" | "primary" | "secondary" | "warning" | "default" | "danger";
  showOnlyDefaults?: boolean; 
  onChange?: (selected: string[]) => void;
}

export default function CheckBoxGroupHorizontal({
  label,
  options,
  defaultValue = [],
  orientation = "horizontal",
  color = "secondary",
  showOnlyDefaults = false,
  onChange,
}: CheckBoxGroupProps) {
  // Conditionally filter options based on `showOnlyDefaults`
  const displayedOptions = showOnlyDefaults
    ? options.filter((option) => defaultValue.includes(option.value))
    : options;

  return (
    <CheckboxGroup
      label={label}
      orientation={orientation}
      color={color}
      defaultValue={defaultValue}
      isDisabled
      onChange={(selected) => onChange && onChange(selected as string[])}
    >
      {displayedOptions.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
