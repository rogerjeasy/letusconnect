"use client";

import { FaBan } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  condition: boolean;
  message: string;
}

export default function AccessDenied({ condition, message }: AccessDeniedProps) {
  const router = useRouter();

  if (!condition) {
    return null;
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <FaBan className="text-red-500 text-6xl" />
        <p className="text-red-500 font-bold text-2xl">{message}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
