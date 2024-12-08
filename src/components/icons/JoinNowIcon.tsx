"use client";

import React from "react";

interface JoinNowIconProps {
  size?: number;       // Icon size in pixels
  color?: string;      // Icon color
  onClick?: () => void; // Optional click handler
}

export default function JoinNowIcon({ size = 24, color = "#0070f3", onClick }: JoinNowIconProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <path
          d="M12 8V12M12 12V16M12 12H16M12 12H8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          marginLeft: "8px",
          color: color,
          fontSize: `${size * 0.6}px`,
          fontWeight: "bold",
        }}
      >
        Join Now
      </span>
    </div>
  );
}