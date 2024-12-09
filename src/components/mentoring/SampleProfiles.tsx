"use client";

import SectionTitle from "../shared/SectionTitle";
import MentorProfileCard from "./MentorProfileCard";

const profiles = [
    {
      name: "Jane Doe",
      role: "Data Scientist (Mentor)",
      image: "https://i.pravatar.cc/150?img=44", // Placeholder image
      detailsLink: "/profiles/jane-doe",
    },
    {
      name: "John Smith",
      role: "Software Engineer (Mentor)",
      image: "https://i.pravatar.cc/150?img=34", // Placeholder image
      detailsLink: "/profiles/john-smith",
    },
    {
      name: "Alice Brown",
      role: "Product Manager (Mentee)",
      image: "https://i.pravatar.cc/150?img=45", // Placeholder image
      detailsLink: "/profiles/alice-brown",
    },
    {
      name: "Michael Johnson",
      role: "UX Designer (Mentee)",
      image: "https://i.pravatar.cc/150?img=36", // Placeholder image
      detailsLink: "/profiles/michael-johnson",
    },
  ];

export default function SampleProfiles() {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle title="Sample Mentor/Mentee Profiles" />
  
          {/* Mentors Row */}
          <h2 className="text-2xl font-bold mb-6 text-teal-600">Mentors</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {profiles
              .filter((profile) => profile.role.includes("Mentor"))
              .map((profile, index) => (
                <MentorProfileCard
                  key={index}
                  name={profile.name}
                  role={profile.role}
                  image={profile.image}
                  detailsLink={profile.detailsLink}
                />
              ))}
          </div>
  
          {/* Mentees Row */}
          <h2 className="text-2xl font-bold mb-6 text-purple-600">Mentees</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {profiles
              .filter((profile) => profile.role.includes("Mentee"))
              .map((profile, index) => (
                <MentorProfileCard
                  key={index}
                  name={profile.name}
                  role={profile.role}
                  image={profile.image}
                  detailsLink={profile.detailsLink}
                />
              ))}
          </div>
        </div>
      </section>
    );
  }