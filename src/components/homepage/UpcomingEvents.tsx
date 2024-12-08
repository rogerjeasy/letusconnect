"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

const events: Event[] = [
  {
    id: "data-science-networking-night",
    title: "Data Science Networking Night",
    date: "June 25, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "HSLU Campus, Lucerne",
    description: "An evening of networking with students, alumni, and industry experts in the field of data science.",
  },
  {
    id: "ai-in-business-webinar",
    title: "AI in Business Webinar",
    date: "July 10, 2024",
    time: "4:00 PM - 5:30 PM",
    location: "Online",
    description: "Learn how AI is transforming business operations in this informative webinar with industry leaders.",
  },
  {
    id: "alumni-meet-greet",
    title: "Alumni Meet & Greet",
    date: "August 5, 2024",
    time: "3:00 PM - 6:00 PM",
    location: "Zurich",
    description: "Reconnect with fellow alumni and explore new collaboration opportunities.",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Upcoming Events & Webinars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-6 rounded-lg shadow-lg bg-white flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardHeader className="mb-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
              </CardHeader>
              <CardBody className="flex flex-col gap-2 text-left">
                <p className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt className="text-teal-500" />
                  <span>{event.date}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-blue-500" />
                  <span>{event.time}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <span>{event.location}</span>
                </p>
                <p className="text-gray-700 mt-4">{event.description}</p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link href={`/events/${event.id}/details`}>
                    <Button
                      color="primary"
                      size="md"
                      radius="lg"
                      className="w-full font-bold transition-transform duration-300 hover:scale-105"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/events/${event.id}/join`}>
                    <Button
                      color="success"
                      size="md"
                      radius="lg"
                      className="w-full font-bold transition-transform duration-300 hover:scale-105"
                    >
                      Join
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <Link href="/events">
            <Button
              color="secondary"
              size="lg"
              radius="lg"
              className="font-bold px-8 py-3 transition-transform duration-300 hover:scale-105"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}