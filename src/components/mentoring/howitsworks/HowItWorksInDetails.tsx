"use client";

import SectionTitle from "../../shared/SectionTitle";
import StepSignUp from "./StepSignUp";
import StepFindMentor from "./StepFindMentor";
import StepScheduleSession from "./StepScheduleSession";
import StepAchieveGoals from "./StepAchieveGoals";

export default function HowItWorksInDetails() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <SectionTitle title="Grow Your Career Step-by-Step" />
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Follow these simple steps to connect with mentors, schedule sessions, and achieve your career goals.
        </p>

        <div className="space-y-16">
          <StepSignUp />
          <StepFindMentor />
          <StepScheduleSession />
          <StepAchieveGoals />
        </div>
      </div>
    </section>
  );
}