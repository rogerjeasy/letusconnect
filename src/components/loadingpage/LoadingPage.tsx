"use client";

import { Spinner } from "@nextui-org/react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-8 h-8" />
    </div>
  );
}