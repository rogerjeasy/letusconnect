"use client";

import { Button } from "@nextui-org/react";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

export default function InteractiveDemo() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
          Explore the Platform with Our Interactive Demo
        </h2>

        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get a quick tour of the platform&rsquo;s key features and see how you can benefit from mentorship, collaboration, and networking.
        </p>

        {/* Embedded Video or Thumbnail with CTA */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <div className="w-full h-0 pb-[56.25%] relative rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Interactive Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
          <Button
            color="primary"
            size="lg"
            radius="lg"
            className="flex items-center gap-2 font-bold px-8"
          >
            <PlayCircle className="w-6 h-6" />
            Watch the Demo
          </Button>
        </Link>
      </div>
    </section>
  );
}