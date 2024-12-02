import { Spinner } from "@nextui-org/react";

interface SpinnerUIProps {
  label: string;
  color?: "primary" | "default" | "secondary" | "success" | "warning" | "danger";
  labelColor?: "foreground" | "primary" | "secondary" | "success" | "warning" | "danger";
}

export default function SpinnerUI({
  label = "Loading...",
  color = "primary",
  labelColor = "foreground",
}: SpinnerUIProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner label={label} color={color} labelColor={labelColor} />
    </div>
  );
}