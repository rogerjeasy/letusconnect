"use client";

import { Select, SelectItem } from "@nextui-org/react";

interface TimePickerProps {
  time: string;
  setTime: (time: string) => void;
}

const times = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function TimePicker({ time, setTime }: TimePickerProps) {
  return (
    <Select
      placeholder="Select Time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      aria-label="Select Time"
    >
      {times.map((t) => (
        <SelectItem key={t} value={t}>
          {t}
        </SelectItem>
      ))}
    </Select>
  );
}