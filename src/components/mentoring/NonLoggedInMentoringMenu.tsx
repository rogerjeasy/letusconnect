"use client"

import OverviewSection from "./OverviewSection"
import BenefitsSection from "./BenefitsSection";
import SampleProfiles from "./SampleProfiles";
import HowItWorks from "./HowItWorks";
import CallToActions from "./CallToActions";
import LimitedAccessFeatures from "./LimitedAccessFeatures/LimitedAccessFeatures";

export default function NonLoggedInMentoringMenu() {
  return (
    <div>
      <OverviewSection />
      <BenefitsSection />
      <SampleProfiles />
      <HowItWorks />
      <LimitedAccessFeatures />
      <CallToActions />
    </div>
  );
}
