"use client";

import { FaUserTie, FaBriefcase, FaHandshake } from "react-icons/fa";
import SectionTitle from "../shared/SectionTitle";

const benefits = [
  {
    title: "Access to Experienced Mentors",
    icon: <FaUserTie size={40} className="text-teal-500" />,
    description: "Connect with mentors who provide guidance and support in your field.",
  },
  {
    title: "Career Development Support",
    icon: <FaBriefcase size={40} className="text-blue-500" />,
    description: "Get help with career decisions, resumes, and interview prep.",
  },
  {
    title: "Networking Opportunities",
    icon: <FaHandshake size={40} className="text-purple-500" />,
    description: "Expand your professional network with like-minded individuals.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      className="py-12 relative text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      <div className="relative container mx-auto px-4">
        <SectionTitle title="Key Benefits of Joining" className="text-white" />
        <div className="flex flex-wrap justify-center gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="w-full max-w-xs p-6 bg-white bg-opacity-90 rounded-lg shadow-md text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
              <p className="text-gray-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
