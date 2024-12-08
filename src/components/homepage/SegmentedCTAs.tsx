"use client";

import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { FaGraduationCap, FaUserGraduate, FaBriefcase } from "react-icons/fa";

interface UserTypeCTA {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  icon: JSX.Element;
  bgColor: string;
}

const userTypes: UserTypeCTA[] = [
  {
    title: "Students",
    description: "Connect with experienced mentors who can guide your academic and career journey.",
    buttonText: "Find a Mentor",
    link: "/mentors",
    icon: <FaGraduationCap size={32} className="text-teal-500" />,
    bgColor: "bg-teal-100",
  },
  {
    title: "Alumni",
    description: "Give back to the community by mentoring students and sharing your expertise.",
    buttonText: "Give Back and Mentor",
    link: "/alumni",
    icon: <FaUserGraduate size={32} className="text-blue-500" />,
    bgColor: "bg-blue-100",
  },
  {
    title: "Industry Experts",
    description: "Join as an industry expert and help shape the future by mentoring and collaborating.",
    buttonText: "Join as an Industry Expert",
    link: "/experts",
    icon: <FaBriefcase size={32} className="text-purple-500" />,
    bgColor: "bg-purple-100",
  },
];

export default function SegmentedCTAs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Discover How You Can Benefit from the Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userTypes.map((userType, index) => (
            <Card
              key={index}
              className={`p-6 rounded-lg shadow-lg ${userType.bgColor} flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <CardHeader className="flex flex-col items-center gap-4">
                {userType.icon}
                <h3 className="text-xl font-bold">{userType.title}</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 mb-6">{userType.description}</p>
                <Link href={userType.link}>
                  <Button
                    color="primary"
                    size="lg"
                    radius="lg"
                    className="font-bold w-full"
                  >
                    {userType.buttonText}
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}