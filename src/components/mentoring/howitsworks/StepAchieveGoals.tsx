"use client";

import { FaTrophy } from "react-icons/fa";
import { Button } from "@nextui-org/react";

export default function StepAchieveGoals() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-6 rounded-full shadow-lg mb-4">
        <FaTrophy size={50} className="text-yellow-500" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Achieve Your Goals</h3>
      <p className="text-gray-600 max-w-lg mb-6">
        Grow your career, expand your network, and develop your skills with guidance from experienced mentors.
      </p>
      <Button color="warning" radius="lg" className="font-bold">
        Start Your Journey
      </Button>
    </div>
  );
}