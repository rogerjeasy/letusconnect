"use client";

import UpcomingMentorshipEvents from "../mentoring/LimitedAccessFeatures/UpcomingMentorshipEvents";

export default function UpcomingEvents() {

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Upcoming Events & Webinars
        </h2> */}

        <UpcomingMentorshipEvents />
      </div>
    </section>
  );
}