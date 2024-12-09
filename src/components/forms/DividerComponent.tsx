"use client";

import { Divider } from "@nextui-org/react";
import React from "react";

interface DividerComponentProps {
  title: string;
  description: string;
  items: string[];
  orientation?: "horizontal" | "vertical";
}

export default function DividerComponent({
  title,
  description,
  items,
  orientation = "vertical",
}: DividerComponentProps) {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-2 mb-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Divider className="my-4" />
      <div className={`flex items-center ${orientation === "horizontal" ? "flex-col space-y-2" : "space-x-4"}`}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="text-sm font-medium">{item}</div>
            {index < items.length - 1 && <Divider orientation={orientation} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}