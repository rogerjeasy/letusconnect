"use client";

import HeroSection from "../herosection/HeroSection";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Additional Sections */}
      {/* Add more sections here for other parts of the homepage */}
    </div>
  );
};

export default HomePage;
