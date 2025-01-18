"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GraduationYearPicker = ({ value, onChange }: {
  value: number,
  onChange: (year: number) => void
}) => {
  const currentYear = new Date().getFullYear();
  const startYear = 1960;
  const endYear = currentYear + 5;
  const years = Array.from(
    { length: endYear - startYear + 1 }, 
    (_, i) => endYear - i
  ).sort((a, b) => b - a);

  return (
    <Select
      value={value.toString()}
      onValueChange={(newValue) => onChange(parseInt(newValue))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select graduation year" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GraduationYearPicker;