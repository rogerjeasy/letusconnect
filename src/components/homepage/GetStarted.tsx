"use client";

import { FaUser, FaUsers, FaBriefcase, FaRocket } from "react-icons/fa";

export default function GetStartedPage() {
  return (
    <section className="bg-gray-50 py-20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Welcome to LetUsConnect
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Your gateway to meaningful connections, career growth, and
          collaboration. Let&rsquo;s start your journey!
        </p>
        <div className="mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
          <button className="px-6 py-3 ml-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition">
            Log In
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Join LetUsConnect?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaUsers className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Build Your Network</h3>
            <p className="text-gray-600">
              Connect with peers, alumni, and industry experts for collaboration
              and mentorship.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaUser className="text-green-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Find a Mentor</h3>
            <p className="text-gray-600">
              Get guidance from experienced mentors to achieve your career
              goals.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaBriefcase className="text-yellow-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
            <p className="text-gray-600">
              Access job postings, internships, and career resources.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FaRocket className="text-teal-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Join projects, participate in events, and innovate with like-minded
              individuals.
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Getting Started is Easy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Step 1: Register</h3>
            <p className="text-gray-600">
              Sign up with your details to gain access to personalized features.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Step 2: Complete Profile</h3>
            <p className="text-gray-600">
              Add a profile picture, your skills, and interests to stand out.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Step 3: Explore</h3>
            <p className="text-gray-600">
              Start connecting, collaborating, and achieving your goals.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 mt-20">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Hear from Our Community
          </h2>
          <p className="text-gray-600 italic">
            &ldquo;LetUsConnect has been instrumental in helping me find the right
            mentors and collaborate on exciting projects.&rdquo;
          </p>
          <p className="text-gray-800 font-bold mt-4">&mdash; Jane Doe</p>
        </div>
      </div>
    </section>
  );
}