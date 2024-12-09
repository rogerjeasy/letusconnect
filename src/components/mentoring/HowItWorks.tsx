"use client";

import { FaUserPlus, FaSearch, FaCalendarCheck, FaTrophy } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import SectionTitle from "../shared/SectionTitle";

const steps = [
  { icon: <FaUserPlus size={50} />, title: "Sign Up" },
  { icon: <FaSearch size={50} />, title: "Find a Mentor/Mentee" },
  { icon: <FaCalendarCheck size={50} />, title: "Schedule a Session" },
  { icon: <FaTrophy size={50} />, title: "Achieve Your Goals" },
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <SectionTitle title="How It Works" />
        
        <div className="flex justify-center items-center gap-8 flex-wrap relative mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center w-56">
              <div className="bg-white p-6 rounded-full shadow-lg mb-4 transform transition-transform duration-300 hover:scale-110">
                <div className="text-teal-500">{step.icon}</div>
              </div>
              <h4 className="text-lg font-bold">{step.title}</h4>
              
              {/* Connector for all but the last step */}
              {index < steps.length - 1 && (
                <div className="absolute right-[-60px] top-[35px] hidden md:block">
                  <div className="w-12 h-1 bg-teal-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/mentorship/how-it-works">
          <Button
            color="primary"
            size="lg"
            radius="lg"
            className="font-bold transition-transform duration-300 hover:scale-105"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
}