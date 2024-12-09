"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center ${className || ""}`}>
      {title}
    </h2>
  );
}
