"use client";

import { FaUsers } from "react-icons/fa";

export default function WhyJoinUs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-600 flex items-center justify-center gap-2">
        <FaUsers /> Why Join Us?
      </h2>
      <p className="text-gray-700 max-w-3xl mx-auto mb-8">
        Our platform is designed to connect you with the right mentors, resources, and opportunities to help you achieve your goals.
        Join a thriving community dedicated to lifelong learning, collaboration, and professional growth.
      </p>
      {/* <Link href="/register">
        <Button color="success" size="lg" radius="lg" className="font-bold">
          Sign Up Now
        </Button>
      </Link> */}
    </div>
  );
}