"use client";

import { Card, CardBody } from "@nextui-org/react";
import { Briefcase, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <Card
      isFooterBlurred
      radius="none"
      className="relative w-screen max-w-full h-[600px] md:h-[750px] border-none overflow-hidden text-white"
    >
      {/* Background Image Slider */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="flex w-[300%] h-full animate-slide">
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
          <div
            className="w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1920&q=80')`,
            }}
          ></div>
        </div>
      </div>

      {/* Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <CardBody className="relative flex flex-col items-center justify-center text-center px-6 py-12 md:py-16 space-y-6 z-10">
        {/* Hero Title */}

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Connecting Students and Alumni for Lifelong Learning and Professional Growth
            <span className="block text-blue-400">While Tracking Your Career Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Join a thriving community of students and alumni while managing your job search journey with our intelligent tracking system.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Sign Up Button with Animated Arrow */}
          <Link href="/get-started">
            <button
              className="rounded-lg px-6 py-3 text-lg font-bold bg-white text-teal-600 hover:bg-teal-100 w-full md:w-auto group transition-transform duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Get Started
                <span className="transition-transform duration-300 transform group-hover:translate-x-2">
                  ➔
                </span>
              </span>
            </button>
          </Link>

          <Link href="/job-tracker">
            <button className="rounded-lg px-6 py-3 text-lg font-bold bg-white text-blue-600 hover:bg-blue-50 w-full md:w-auto group transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Track Your Applications
            </button>
          </Link>

          {/* Explore Community Button */}
          <Link href="/explore-the-community">
            <button
              className="rounded-lg px-6 py-3 text-lg font-bold text-white border border-white hover:bg-white/10 w-full md:w-auto transition-transform duration-300 hover:scale-105"
            >
              Explore the Community
            </button>
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
  );
}