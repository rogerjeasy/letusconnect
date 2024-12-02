import { useState } from "react";
import { DatePicker, DateValue } from "@nextui-org/react";

interface InputDateProps {
  label?: string;
  defaultValue?: DateValue | null; // Accept DateValue
  onChange?: (date: DateValue | null) => void;
}

export default function InputDate({
  label = "Select Date",
  defaultValue = null,
  onChange,
}: InputDateProps) {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(defaultValue);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-row gap-4">
      <DatePicker
        label={label}
        variant="bordered"
        showMonthAndYearPickers
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
}