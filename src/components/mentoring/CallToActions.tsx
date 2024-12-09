"use client";

import Link from "next/link";
import { Button } from "@nextui-org/react";
import SectionTitle from "../shared/SectionTitle";

export default function CallToActions() {
  return (
    <section
      className="py-12 relative text-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1551024739-78e9d60c45ca?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <div className="relative container mx-auto px-4">
        <SectionTitle title="Get Started Today!" className="text-white" />
        <p className="text-white max-w-2xl mx-auto mb-8">
          Join our platform to connect with mentors, explore career opportunities, and grow your professional network.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button
              color="primary"
              size="lg"
              radius="lg"
              className="font-bold transition-transform duration-300 hover:scale-105"
            >
              Sign Up to Find a Mentor
            </Button>
          </Link>
          <Link href="/register">
            <Button
              color="success"
              size="lg"
              radius="lg"
              className="font-bold transition-transform duration-300 hover:scale-105"
            >
              Join as a Mentor
            </Button>
          </Link>
          <Link href="/community">
            <Button
              color="secondary"
              size="lg"
              radius="lg"
              className="font-bold transition-transform duration-300 hover:scale-105"
            >
              Explore Our Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
