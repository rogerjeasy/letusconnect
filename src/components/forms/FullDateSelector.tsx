"use client";

import { DatePicker } from "@nextui-org/react";
import { DateValue, parseDate } from "@internationalized/date";

interface FullDateSelectorProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  showMonthAndYearPickers?: boolean;
  variant?: "flat" | "bordered" | "underlined" | "faded";
}

export default function FullDateSelector({
  label,
  value,
  onChange,
  showMonthAndYearPickers = true,
  variant = "bordered",
}: FullDateSelectorProps) {
  // Ensure value is a valid Date object before calling toISOString
  const dateValue: DateValue | null = value instanceof Date && !isNaN(value.getTime())
    ? parseDate(value.toISOString().split("T")[0])
    : null;

  // Handle the onChange event
  const handleDateChange = (newDate: DateValue) => {
    onChange(newDate ? new Date(newDate.year, newDate.month - 1, newDate.day) : null);
  };

  return (
    <DatePicker
      label={label}
      value={dateValue}
      onChange={handleDateChange}
      showMonthAndYearPickers={showMonthAndYearPickers}
      variant={variant}
    />
  );
}