"use client";

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import SectionTitle from "../../shared/SectionTitle";
import Link from "next/link";

// Filter options data
const expertiseOptions = [
  { key: "data-science", label: "Data Science" },
  { key: "software-engineering", label: "Software Engineering" },
  { key: "ux-design", label: "UX Design" },
  { key: "marketing", label: "Marketing" },
];

const industryOptions = [
  { key: "tech", label: "Technology" },
  { key: "finance", label: "Finance" },
  { key: "healthcare", label: "Healthcare" },
  { key: "education", label: "Education" },
];

const goalsOptions = [
  { key: "career-growth", label: "Career Growth" },
  { key: "skill-development", label: "Skill Development" },
  { key: "networking", label: "Networking" },
  { key: "entrepreneurship", label: "Entrepreneurship" },
];

export default function FindMentorMentee() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title="🔍 Find a Mentor / Mentee" />

        <Card className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
          <CardHeader className="flex flex-col items-center gap-2 mb-4">
            <FaSearch size={40} className="text-teal-500" />
            <h3 className="text-2xl font-bold text-center">Connect with Mentors or Mentees</h3>
          </CardHeader>

          <CardBody className="space-y-6">
            <p className="text-gray-600 text-center mb-6">
              Connect with mentors or mentees based on your goals, skills, or industry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expertise Filter */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Area of Expertise</label>
                <Select placeholder="Select Expertise" aria-label="Expertise">
                  {expertiseOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Industry</label>
                <Select placeholder="Select Industry" aria-label="Industry">
                  {industryOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Career Goals Filter */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Career Goals</label>
                <Select placeholder="Select Career Goals" aria-label="Career Goals">
                  {goalsOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Availability</label>
                <Input type="date" placeholder="Select Date" aria-label="Availability" />
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Link href="/mentorship/search">
                <Button color="primary" size="lg" radius="lg" className="font-bold">
                  Search Now
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}