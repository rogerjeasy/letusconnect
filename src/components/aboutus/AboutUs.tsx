"use client";

import AboutHeroSection from "./AboutHeroSection";
import CoreValues from "./CoreValues";
import MeetTheTeam from "./MeetTheTeam";
import MissionVisionSection from "./MissionVisionSection";
import OurStorySection from "./OuStorySection";
import PartnersAffiliations from "./PartnersAffiliations";


const AboutUs = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <AboutHeroSection />
        <MissionVisionSection />
        <OurStorySection />
        <MeetTheTeam />
        <CoreValues />
        <PartnersAffiliations />
        </div>
    );
};

export default AboutUs;
