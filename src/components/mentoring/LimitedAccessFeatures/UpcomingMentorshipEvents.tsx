"use client";

import { Card, CardBody, CardHeader, Button, Link } from "@nextui-org/react";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import SeeEvent from "../../forms/SeeEvents";
import { EventDetails } from "../../../store/eventDetails";
import SeeEventButton from "../../buttons/SeeEventButton";

const events: EventDetails[] = [
  {
    id: "1",
    hostedBy: "Data Science Club",
    hostEmail: "host1@example.com",
    appEmail: "app1@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=host1",
    title: "Data Science Networking Night",
    date: "June 25, 2024",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    location: "Zurich, Switzerland",
    specificAddress: "Technopark Zurich, 8005",
    description: "Join fellow data science enthusiasts for networking and insights.",
    attendees: [
      { name: "Alice", avatarUrl: "https://i.pravatar.cc/150?u=alice" },
      { name: "Bob", avatarUrl: "https://i.pravatar.cc/150?u=bob" },
      { name: "Charlie", avatarUrl: "https://i.pravatar.cc/150?u=charlie" },
      { name: "Diana", avatarUrl: "https://i.pravatar.cc/150?u=diana" },
      { name: "Eve", avatarUrl: "https://i.pravatar.cc/150?u=eve" },
      { name: "Frank", avatarUrl: "https://i.pravatar.cc/150?u=frank" },
      { name: "Grace", avatarUrl: "https://i.pravatar.cc/150?u=grace" },
    ],
    isOnline: false,
    city: "Zurich",
    state: "ZH",
    postalCode: "8005",
    country: "Switzerland",
    isEditing: false,
  },
  {
    id: "2",
    hostedBy: "AI Innovators Group",
    hostEmail: "host2@example.com",
    appEmail: "app2@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=host2",
    title: "AI in Business Webinar",
    date: "July 10, 2024",
    startTime: "4:00 PM",
    endTime: "5:30 PM",
    location: "Online - Zoom",
    description: "Explore how AI is transforming business operations.",
    attendees: [
      { name: "Hannah", avatarUrl: "https://i.pravatar.cc/150?u=hannah" },
      { name: "Ian", avatarUrl: "https://i.pravatar.cc/150?u=ian" },
      { name: "Jack", avatarUrl: "https://i.pravatar.cc/150?u=jack" },
      { name: "Karen", avatarUrl: "https://i.pravatar.cc/150?u=karen" },
      { name: "Leo", avatarUrl: "https://i.pravatar.cc/150?u=leo" },
      { name: "Mia", avatarUrl: "https://i.pravatar.cc/150?u=mia" },
      { name: "Nathan", avatarUrl: "https://i.pravatar.cc/150?u=nathan" },
      { name: "Olivia", avatarUrl: "https://i.pravatar.cc/150?u=olivia" },
    ],
    isOnline: true,
    eventLink: "https://zoom.us/j/123456789",
    isEditing: false,
  },
  {
    id: "3",
    hostedBy: "Tech Leaders Forum",
    hostEmail: "host3@example.com",
    appEmail: "app3@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=host3",
    title: "Tech Innovations Summit",
    date: "August 15, 2024",
    startTime: "9:00 AM",
    endTime: "4:00 PM",
    location: "Berlin, Germany",
    specificAddress: "Berlin Convention Center, Room A",
    description: "A full-day summit covering the latest in tech innovations.",
    attendees: [
      { name: "Paul", avatarUrl: "https://i.pravatar.cc/150?u=paul" },
      { name: "Quinn", avatarUrl: "https://i.pravatar.cc/150?u=quinn" },
      { name: "Rachel", avatarUrl: "https://i.pravatar.cc/150?u=rachel" },
      { name: "Steve", avatarUrl: "https://i.pravatar.cc/150?u=steve" },
      { name: "Tina", avatarUrl: "https://i.pravatar.cc/150?u=tina" },
      { name: "Uma", avatarUrl: "https://i.pravatar.cc/150?u=uma" },
      { name: "Victor", avatarUrl: "https://i.pravatar.cc/150?u=victor" },
      { name: "Wendy", avatarUrl: "https://i.pravatar.cc/150?u=wendy" },
      { name: "Xander", avatarUrl: "https://i.pravatar.cc/150?u=xander" },
    ],
    isOnline: false,
    city: "Berlin",
    state: "BE",
    postalCode: "10115",
    country: "Germany",
    isEditing: false,
  },
];

export default function UpcomingMentorshipEvents() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);

  const openDrawer = (event: EventDetails) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedEvent(null);
    setIsDrawerOpen(false);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Upcoming Mentorship Events & Webinars
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
                  <span>{event.startTime} - {event.endTime}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <span>{event.location}</span>
                </p>
                <p className="text-gray-700 mt-4">{event.description}</p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <SeeEventButton
                      color="primary"
                      size="md"
                      radius="lg"
                      className="w-full"
                      onClick={() => openDrawer(event)}
                    />


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
          {/* SeeEvent Drawer */}
            {selectedEvent && <SeeEvent isOpen={isDrawerOpen} onClose={closeDrawer} event={selectedEvent} />}
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