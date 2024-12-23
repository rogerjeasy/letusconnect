"use client";

import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { FaHandshake, FaBriefcase, FaFileAlt } from "react-icons/fa";

const mentorships = [
  {
    title: "Meet Your Potential Mentors",
    description: "Discover mentors aligned with your goals.",
  },
  {
    title: "Mentorship Requests Pending",
    description: "You have 2 pending mentorship requests.",
  },
];

const careerResources = [
  {
    title: "Recommended Job Postings",
    description: "Explore 5 new job opportunities tailored for you.",
    icon: <FaBriefcase className="text-green-600 text-2xl" />,
  },
  {
    title: "Recently Uploaded Resumes",
    description: "Browse recently shared resumes in the community.",
    icon: <FaFileAlt className="text-blue-600 text-2xl" />,
  },
];

export default function PersonalizedResourcesDashboard() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Personalized Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card isHoverable className="transition-transform hover:scale-105 shadow-lg">
            <CardHeader className="flex items-center gap-4">
              <FaHandshake className="text-orange-600 text-3xl" />
              <h3 className="text-lg font-bold text-gray-800">Mentorship Opportunities</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4">
                {mentorships.map((item, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-semibold text-gray-800">{item.title}</span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card isHoverable className="transition-transform hover:scale-105 shadow-lg">
            <CardHeader className="flex items-center gap-4">
              <FaBriefcase className="text-green-600 text-3xl" />
              <h3 className="text-lg font-bold text-gray-800">Career Resources</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-4">
                {careerResources.map((item, index) => (
                  <li key={index} className="flex flex-col">
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      {item.icon} {item.title}
                    </span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}