"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FaUsers, FaLightbulb, FaChartLine, FaShieldAlt, FaUniversalAccess, FaStar } from "react-icons/fa";

interface CoreValue {
  title: string;
  description: string;
  icon: JSX.Element;
}

const coreValues: CoreValue[] = [
  {
    title: "Collaboration",
    description: "We foster meaningful connections between students, alumni, and industry experts to create opportunities for growth and innovation.",
    icon: <FaUsers size={48} className="text-teal-500" />,
  },
  {
    title: "Innovation",
    description: "We encourage creative solutions and continuous improvement in networking, mentorship, and career development.",
    icon: <FaLightbulb size={48} className="text-yellow-500" />,
  },
  {
    title: "Growth",
    description: "We support lifelong learning, mentorship, and personal and professional development for all users.",
    icon: <FaChartLine size={48} className="text-blue-500" />,
  },
  {
    title: "Integrity",
    description: "We build trust and transparency within the community through ethical practices and honest communication.",
    icon: <FaShieldAlt size={48} className="text-purple-500" />,
  },
  {
    title: "Inclusivity",
    description: "We create an inclusive platform that welcomes users of all backgrounds, fostering a diverse and supportive community.",
    icon: <FaUniversalAccess size={48} className="text-cyan-500" />,
  },
  {
    title: "Excellence",
    description: "We strive for excellence and continuous improvement in everything we offer to our community.",
    icon: <FaStar size={48} className="text-orange-500" />,
  },
];

export default function CoreValues() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <Card
              key={index}
              className="p-6 rounded-lg shadow-lg bg-white flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardHeader className="mb-4">{value.icon}</CardHeader>
              <CardBody>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}