"use client";

import BlogResourcesSection from "./BlogResourcesSection";
import CommunityStats from "./CommunityStats";
import HeroSection from "./HeroSection";
import InteractiveDemo from "./InteractiveDemo";
import FeatureOverview from "./KeyFeatures";
import SegmentedCTAs from "./SegmentedCTAs";
import TestimonialsCarousel from "./TestimonialsCarousel";
import UpcomingEvents from "./UpcomingEvents";

const HomePageComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <HeroSection />
      <FeatureOverview />
      <TestimonialsCarousel />
      <CommunityStats />
      <InteractiveDemo />
      <SegmentedCTAs />
      <UpcomingEvents />
      <BlogResourcesSection />
    </div>
  );
};

export default HomePageComponent;
