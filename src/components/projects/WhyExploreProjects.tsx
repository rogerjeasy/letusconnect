"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { FaLightbulb, FaNetworkWired, FaTools, FaHandHoldingHeart, FaUserFriends, FaHandshake } from "react-icons/fa";

const benefits = [
  {
    title: "Build Strong Teams",
    description: "Form teams with like-minded individuals to achieve project goals effectively.",
    icon: <FaHandshake className="text-orange-500 text-4xl" />,
    bgColor: "bg-orange-100",
  },
  {
    title: "Collaborate with Peers",
    description: "Work together with fellow students to create amazing projects and learn from each other.",
    icon: <FaUserFriends className="text-purple-500 text-4xl" />,
    bgColor: "bg-purple-100",
  },
  {
    title: "Discover Innovative Ideas",
    description: "Learn about cutting-edge projects in various industries.",
    icon: <FaLightbulb className="text-yellow-500 text-4xl" />,
    bgColor: "bg-yellow-100",
  },
  {
    title: "Network with Professionals",
    description: "Collaborate and connect with project owners, students, and alumni.",
    icon: <FaNetworkWired className="text-blue-500 text-4xl" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "Enhance Your Skills",
    description: "Participate in real-world projects to sharpen your skills.",
    icon: <FaTools className="text-green-500 text-4xl" />,
    bgColor: "bg-green-100",
  },
  {
    title: "Contribute to Meaningful Work",
    description: "Join projects that make a real impact in fields like healthcare, education, and technology.",
    icon: <FaHandHoldingHeart className="text-red-500 text-4xl" />,
    bgColor: "bg-red-100",
  },
];

const WhyExploreProjects = () => {
  return (
    <section className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center">🎁 Why Explore Projects?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className={`p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ${benefit.bgColor}`}
          >
            <CardHeader className="flex items-center gap-4">
              <div>{benefit.icon}</div>
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">{benefit.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WhyExploreProjects;