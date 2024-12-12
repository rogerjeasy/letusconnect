"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { FaUserFriends, FaComments, FaBriefcase, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Users } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

const features: Feature[] = [
  {
    title: "Mentoring Platform",
    description: "Connect students and alumni for mentorship based on expertise, goals, or industries.",
    icon: <FaUserFriends size={32} className="text-teal-500" />,
  },
  {
    title: "Connect with Fellow Students",
    description: "Directory, chat, and forums to network and collaborate with students and alumni.",
    icon: <FaComments size={32} className="text-cyan-500" />,
  },
  {
    title: "Job Opportunities",
    description: "Job board, alerts, and career resources for professional growth.",
    icon: <FaBriefcase size={32} className="text-blue-500" />,
  },
  {
    title: "Events",
    description: "Stay informed about university events, webinars, and networking opportunities.",
    icon: <FaCalendarAlt size={32} className="text-purple-500" />,
  },
  {
    title: "Testimonies & Success Stories",
    description: "Read inspiring stories from alumni and current students.",
    icon: <FaStar size={32} className="text-yellow-500" />,
  },
  {
    title: "Alumni-Student Collaboration",
    description: "Facilitate academic collaborations, start-ups, and project support.",
    icon: <Users className="w-8 h-8 text-blue-600" />,
  },
];

export default function FeatureOverview() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Platform Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <Card
                className={`p-6 rounded-lg shadow-lg transform transition-transform duration-300 will-change-transform
                  ${activeFeature === index 
                    ? 'scale-105 bg-white border-2 border-blue-500' 
                    : 'bg-gray-50 hover:bg-white'}`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                style={{ transformOrigin: "center" }}
              >
                <CardHeader className="flex items-center gap-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">{feature.description}</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="mt-12 text-center">
          <Link href="/testimonies">
            <button className="bg-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}