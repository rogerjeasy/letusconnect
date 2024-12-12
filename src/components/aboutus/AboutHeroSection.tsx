"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import Link from "next/link";

export default function AboutHeroSection() {
  return (
    <div className="pt-15 md:pt-25"> {/* Added top padding to avoid navbar overlap */}
      <Card
        isFooterBlurred
        radius="none"
        className="relative w-screen max-w-full h-[400px] md:h-[350px] border-none overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white"
      >
        {/* Background Image Slider */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="flex w-[300%] h-full animate-slide">
            <img
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1600&q=80"
              alt="Students Collaborating"
              className="w-1/3 h-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1600&q=80"
              alt="Team Meeting"
              className="w-1/3 h-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80"
              alt="Mentorship Session"
              className="w-1/3 h-full object-cover"
            />
          </div>
        </div>

        {/* Overlay for Readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-1"></div>

        <CardBody className="relative flex flex-col items-center justify-center text-center px-6 py-12 md:py-16 space-y-6 z-10">
          {/* Hero Title */}
          <h1 className="text-3xl md:text-4xl font-bold">
            Discover Our Mission and Vision
          </h1>

          {/* Hero Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            We connect students, alumni, and industry experts to foster lifelong learning, collaboration, and professional growth.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/about">
              <Button
                radius="lg"
                size="lg"
                color="primary"
                className="bg-white text-teal-600 font-bold hover:bg-teal-100 w-full md:w-auto group"
              >
                <span className="flex items-center gap-2">
                  Learn More
                  <span className="transition-transform duration-300 transform group-hover:translate-x-2">
                    ➔
                  </span>
                </span>
              </Button>
            </Link>

            <Link href="/register">
              <Button
                radius="lg"
                size="lg"
                variant="bordered"
                className="text-white border-white font-bold hover:bg-white/10 w-full md:w-auto"
              >
                Join the Community
              </Button>
            </Link>
          </div>
        </CardBody>

        {/* Custom CSS for Animation */}
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-66.66%);
            }
          }

          .animate-slide {
            animation: slide 20s linear infinite;
          }
        `}</style>
      </Card>
    </div>
  );
}