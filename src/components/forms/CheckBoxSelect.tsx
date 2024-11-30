"use client";

import { CheckboxGroup, Checkbox } from "@nextui-org/react";

interface CheckBoxSelectProps {
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string[];
  onChange?: (selected: string[]) => void;
}

export default function CheckBoxSelect({
  label,
  options,
  defaultValue = [],
  onChange,
}: CheckBoxSelectProps) {
  return (
    <CheckboxGroup
      label={label}
      defaultValue={defaultValue}
      onChange={(selected) => onChange && onChange(selected as string[])}
    >
      {options.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}