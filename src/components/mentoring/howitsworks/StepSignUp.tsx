"use client";

import { FaUserPlus } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from 'next/link'

export default function StepSignUp() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-white p-6 rounded-full shadow-lg mb-4">
        <FaUserPlus size={50} className="text-teal-500" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Sign Up</h3>
      <p className="text-gray-600 max-w-lg mb-6">
        Create your account to access a network of mentors and personalized recommendations.
      </p>
      <Link href="/register">
        <Button color="primary" radius="lg" className="font-bold">
            Create Your Account
        </Button>
      </Link>
    </div>
  );
}