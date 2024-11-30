import { ScrollShadow } from "@nextui-org/react";
import React, { ReactNode } from "react";

interface ScrollProps {
  children: ReactNode; // Accept any React component or element
  className?: string; // Optional custom class for the ScrollShadow container
}

export default function Scroll({ children, className }: ScrollProps) {
  return (
    <ScrollShadow className={`w-[300px] h-[400px] ${className || ""}`}>
      {children}
    </ScrollShadow>
  );
}