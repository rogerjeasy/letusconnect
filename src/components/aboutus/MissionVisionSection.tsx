"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { FaLightbulb, FaChartLine } from "react-icons/fa";

export default function MissionVisionSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          Our Mission and Vision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mission Card */}
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex items-center gap-4 p-6">
              <FaLightbulb size={40} className="text-yellow-500" />
              <h3 className="text-xl font-bold">Our Mission</h3>
            </CardHeader>
            <CardBody className="p-6">
              <p className="text-gray-700 mb-4">
                Our mission is to create a dynamic platform where students, alumni, and industry experts can connect, collaborate, and grow. We aim to foster an ecosystem of lifelong learning, mentorship, and innovation.
              </p>
              <img
                src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
                alt="Mission Image"
                className="rounded-lg object-cover w-full h-64"
              />
            </CardBody>
          </Card>

          {/* Vision Card */}
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <CardHeader className="flex items-center gap-4 p-6">
              <FaChartLine size={40} className="text-teal-500" />
              <h3 className="text-xl font-bold">Our Vision</h3>
            </CardHeader>
            <CardBody className="p-6">
              <p className="text-gray-700 mb-4">
                Our vision is to become the leading networking and collaboration platform that empowers individuals to achieve personal and professional growth through meaningful connections and shared knowledge.
              </p>
              <img
                src="https://images.pexels.com/photos/3184395/pexels-photo-3184395.jpeg"
                alt="Vision Image"
                className="rounded-lg object-cover w-full h-64"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}