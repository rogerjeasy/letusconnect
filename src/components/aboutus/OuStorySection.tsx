"use client";

import {
  FaLightbulb,
  FaComments,
  FaRocket,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const milestones: Milestone[] = [
  {
    year: "October 2024",
    title: "Idea Genesis",
    description:
      "Noticed challenges faced by students in finding team members for group projects, connecting with alumni for insights, and forming long-lasting collaborations.",
    icon: <FaLightbulb className="text-yellow-500" size={40} />,
  },
  {
    year: "November 2024",
    title: "Feedback & Validation",
    description:
      "Discussed the project idea with close friends and collected invaluable feedback that refined the concept further.",
    icon: <FaComments className="text-purple-500" size={40} />,
  },
  {
    year: "Mid-November 2024",
    title: "Implementation Kickoff",
    description:
      "Started the development journey to create a platform fostering networking, mentoring, and collaboration among the university's vibrant community.",
    icon: <FaRocket className="text-teal-500" size={40} />,
  },
  {
    year: "March 2025",
    title: "Beta Version Launch",
    description:
      "Prepare for the release of the beta version with core features, ensuring a seamless experience for early adopters.",
    icon: <FaCheckCircle className="text-green-500" size={40} />,
  },
];

export default function OurStorySection() {
  return (
    <section className="bg-gray-50 py-20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-20 text-center max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Building Connections, Empowering Communities
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          What started as an observation of everyday challenges has evolved into
          a bold vision to connect students, alumni, and industry experts in a
          vibrant ecosystem of collaboration, networking, and opportunity.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          The Journey So Far
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
            >
              <div className="flex-shrink-0">{milestone.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {milestone.year}
                </h3>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                  {milestone.title}
                </h4>
                <p className="text-gray-600 text-md">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 mt-20">
        <div className="container mx-auto px-6 lg:px-20 text-center max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            A Platform with a Purpose
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            <strong>LetUsConnect</strong> is more than just an application—it’s a
            mission to empower communities through meaningful connections. By
            bridging the gap between students, alumni, and industry experts, we
            aim to inspire innovation, mentorship, and career growth.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 lg:px-20 mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Community Says
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 italic">
              “This platform is a game-changer! I’ve been able to connect with
              alumni who’ve given me invaluable career advice.”
            </p>
            <div className="mt-4 text-gray-800 font-bold">— Jane Doe</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 italic">
              “I’ve always struggled to find project partners, but LetUsConnect
              has made it incredibly easy.”
            </p>
            <div className="mt-4 text-gray-800 font-bold">— John Smith</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600 italic">
              “The idea of fostering collaboration and mentorship within our
              university community is truly inspiring.”
            </p>
            <div className="mt-4 text-gray-800 font-bold">— Emily Johnson</div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 py-16 mt-20 text-center text-white">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Movement
          </h2>
          <p className="text-lg md:text-xl mb-8 leading-relaxed">
            Be part of a community that’s redefining what it means to connect,
            collaborate, and grow. Together, we can achieve extraordinary
            things.
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
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
