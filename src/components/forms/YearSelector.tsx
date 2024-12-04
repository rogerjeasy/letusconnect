"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface YearSelectorProps {
  startYear?: number;
  endYear?: number;
  label: string;
  placeholder?: string;
  className?: string;
  onChange?: (selectedYear: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  startYear = 1950,
  endYear = new Date().getFullYear() + 8,
  label,
  placeholder = "Select a year",
  className="font-bold",
  onChange,
}) => {
  const handleSelectionChange = (selectedYear: string) => {
    if (onChange) {
      onChange(selectedYear);
    }
  };

  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) =>
    (endYear - index).toString()
  );

  return (
    <Select
      items={years.map((year) => ({ key: year, label: year }))}
      label={label}
      placeholder={placeholder}
      className={className}
      onSelectionChange={(key) => handleSelectionChange(key as string)}
    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
};

export default YearSelector;