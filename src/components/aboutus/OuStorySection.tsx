"use client";

import { FaLightbulb, FaRocket, FaUsers, FaCheckCircle } from "react-icons/fa";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const milestones: Milestone[] = [
  {
    year: "2022",
    title: "Inception of the Idea",
    description: "Recognized the need for a platform to connect students, alumni, and industry experts.",
    icon: <FaLightbulb className="text-yellow-500" size={40} />,
  },
  {
    year: "2024",
    title: "Beta Testing",
    description: "Invited early adopters to test the platform and provide feedback for improvement.",
    icon: <FaUsers className="text-blue-500" size={40} />,
  },
  {
    year: "2023",
    title: "Development Phase",
    description: "Began development with a focus on creating a seamless and collaborative experience.",
    icon: <FaRocket className="text-teal-500" size={40} />,
  },
  {
    year: "2024",
    title: "Official Launch Coming Soon",
    description: "We're gearing up for the official launch. Stay tuned for the big reveal!",
    icon: <FaCheckCircle className="text-green-500" size={40} />,
  },
];

export default function OurStorySection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 max-w-screen-2xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
          Our Story
        </h2>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-4xl mx-auto mb-12 leading-relaxed">
          Our platform was born from a vision to bridge the gap between students, alumni, and industry experts. As we prepare for launch, we're excited to share the milestones that have shaped our journey so far.
        </p>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {milestones.slice(0, 2).map((milestone, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-4 bg-gray-50 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 animate-fadeIn"
            >
              <div className="flex-shrink-0">{milestone.icon}</div>
              <div>
                <h3 className="text-2xl font-bold">{milestone.year}</h3>
                <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                <p className="text-gray-600 text-md">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {milestones.slice(2).map((milestone, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-4 bg-gray-50 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 animate-fadeIn"
            >
              <div className="flex-shrink-0">{milestone.icon}</div>
              <div>
                <h3 className="text-2xl font-bold">{milestone.year}</h3>
                <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                <p className="text-gray-600 text-md">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </section>
  );
}