"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

export default function UpcomingEvents() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center justify-center gap-2">
        <FaCalendarAlt /> Upcoming Events & Webinars
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardHeader className="font-bold text-lg">Data Science Networking Night</CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">June 25, 2024 | 6:00 PM - 9:00 PM</p>
            <Link href="/events">
              <Button color="primary" radius="lg" className="w-full">
                View Event
              </Button>
            </Link>
          </CardBody>
        </Card>
        <Card className="w-80 p-4 rounded-lg shadow-md">
          <CardHeader className="font-bold text-lg">AI in Business Webinar</CardHeader>
          <CardBody>
            <p className="text-gray-600 mb-4">July 10, 2024 | 4:00 PM - 5:30 PM</p>
            <Link href="/events">
              <Button color="primary" radius="lg" className="w-full">
                View Event
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}