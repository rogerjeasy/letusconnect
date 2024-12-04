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
  className="font-bold",
  onChange,
}) => {
  const handleSelectionChange = (selectedKey: string) => {
    if (onChange) {
      onChange(selectedKey);
    }
  };

  return (
    <Select
      items={options}
      label={label}
      placeholder={placeholder}
      className={className}
      onSelectionChange={(key) => handleSelectionChange(key as string)}
    >
      {(option) => <SelectItem key={option.key}>{option.label}</SelectItem>}
    </Select>
  );
};

export default SingleDropdownSelection;