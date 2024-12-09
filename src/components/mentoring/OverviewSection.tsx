"use client";

import SectionTitle from "../shared/SectionTitle";

export default function OverviewSection() {
  return (
    <section
      className="py-12 bg-gray-50 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <SectionTitle title="Welcome to Our Mentoring Platform" />
        <p className="text-gray-200 mb-6 max-w-3xl mx-auto">
          Our platform connects students, alumni, and industry experts to foster lifelong learning, collaboration, and career growth.
        </p>

        {/* YouTube Video Embed */}
        <div className="w-full max-w-3xl mx-auto rounded-lg shadow-md overflow-hidden">
          <iframe
            className="w-full h-64 sm:h-80 md:h-96"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your desired YouTube video link
            title="Mentoring Platform Overview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}