"use client";

import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { EventDetails } from "../../store/eventDetails";
import { useState } from "react";
import SeeEvent from "../forms/SeeEvents";
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