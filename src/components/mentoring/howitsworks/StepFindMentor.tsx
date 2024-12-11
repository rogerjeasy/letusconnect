"use client";

import { FaSearch } from "react-icons/fa";
import { Button } from "@nextui-org/react";

export default function StepFindMentor() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-6 rounded-full shadow-lg mb-4">
        <FaSearch size={50} className="text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Find a Mentor/Mentee</h3>
      <p className="text-gray-600 max-w-lg mb-6">
        Browse profiles, filter by expertise, and find the perfect match to help you grow.
      </p>
      <Button color="secondary" radius="lg" className="font-bold">
        Browse Mentors
      </Button>
    </div>
  );
}