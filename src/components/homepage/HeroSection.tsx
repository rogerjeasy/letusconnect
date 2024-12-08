"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <Card
      isFooterBlurred
      radius="none"
      className="relative w-screen max-w-full border-none overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white"
    >
      <CardBody className="flex flex-col items-center justify-center text-center px-6 py-12 md:py-16 space-y-6">
        {/* Hero Title */}
        <h1 className="text-3xl md:text-4xl font-bold">
          Connecting Students and Alumni for Lifelong Learning and Professional Growth
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-white/80">
          Join a thriving community of students, alumni, and experts to advance your career, share knowledge, and build lasting connections.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Sign Up Button with Animated Arrow */}
          <Link href="/register">
            <Button
              radius="lg"
              size="lg"
              color="primary"
              className="bg-white text-teal-600 font-bold hover:bg-teal-100 w-full md:w-auto group"
            >
              <span className="flex items-center gap-2">
                Get Started
                <span className="transition-transform duration-300 transform group-hover:translate-x-2">
                  ➔
                </span>
              </span>
            </Button>
          </Link>

          {/* Explore Community Button */}
          <Link href="/community">
            <Button
              radius="lg"
              size="lg"
              variant="bordered"
              className="text-white border-white font-bold hover:bg-white/10 w-full md:w-auto"
            >
              Explore the Community
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}