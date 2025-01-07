"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

const ProjectHeaderSection = () => {
  const { isAuthenticated } = useUserStore();


  return (
    <div
      className="relative bg-cover bg-center h-[60vh] md:h-[50vh] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 p-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Discover Exciting Projects and Collaborate with Innovators!
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-3xl mx-auto">
          Explore a diverse range of projects in data science, AI, and beyond. Find the perfect project to match your interests and skills.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Show Sign Up button only if the user is not authenticated */}
          {!isAuthenticated && (
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
            >
              Sign Up to Join Projects
            </Link>
          )}
          <Link
            href="/projects/why-projects"
            className="bg-white text-gray-800 hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
          >
            Learn More About Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeaderSection;