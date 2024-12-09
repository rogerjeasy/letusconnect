"use client";

import { Card, CardBody } from "@nextui-org/react";
import { FaQuoteLeft } from "react-icons/fa";
import SectionTitle from "../../shared/SectionTitle";

export default function PublicTestimonials() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-teal-600 flex items-center justify-center gap-2">
        <FaQuoteLeft /> Public Testimonials
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardBody>
            <p className="text-gray-700 italic mb-4">
              "This platform connected me with a mentor who transformed my career path!"
            </p>
            <h4 className="font-bold text-gray-800">- Jane Doe, Data Scientist</h4>
          </CardBody>
        </Card>
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardBody>
            <p className="text-gray-700 italic mb-4">
              "I found invaluable advice and resources to prepare for my dream job."
            </p>
            <h4 className="font-bold text-gray-800">- John Smith, Software Engineer</h4>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
