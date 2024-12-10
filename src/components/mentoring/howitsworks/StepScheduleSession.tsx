"use client";

import { FaCalendarCheck } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function StepScheduleSession() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-6 rounded-full shadow-lg mb-4">
        <FaCalendarCheck size={50} className="text-purple-500" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Schedule a Session</h3>
      <p className="text-gray-600 max-w-lg mb-6">
        Book mentoring sessions at times that work for you. Calendar integration makes it easy.
      </p>
      <Button color="success" radius="lg" className="font-bold">
        Book a Session
      </Button>
    </div>
  );
}