"use client";

import {
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaUsers,
  FaBullhorn,
  FaQuestionCircle,
} from "react-icons/fa";

export const eventsOptions = {
  // Authenticated Users: Events
  events: [
    { label: "View Events", icon: <FaCalendarAlt className="text-blue-500" />, link: "/events/view" },
    { label: "My RSVPs", icon: <FaCheckCircle className="text-green-500" />, link: "/events/rsvps" },
    { label: "Create an Event", icon: <FaStar className="text-yellow-500" />, link: "/events/create" },
    { label: "Hosted Events", icon: <FaUsers className="text-purple-500" />, link: "/events/hosted" },
    { label: "Event Analytics", icon: <FaBullhorn className="text-red-500" />, link: "/events/analytics" },
  ],

  // Non-Authenticated Users: Events
  eventsNonAuth: [
    { label: "Explore Events", icon: <FaCalendarAlt className="text-blue-500" />, link: "/events/explore" },
    { label: "Upcoming Events", icon: <FaStar className="text-yellow-500" />, link: "/events/upcoming-events" },
    { label: "Featured Events", icon: <FaBullhorn className="text-red-500" />, link: "/events/featured-event" },
    { label: "Conferences", icon: <FaUsers className="text-purple-500" />, link: "/events/conferences" },
    { label: "Events FAQs", icon: <FaQuestionCircle className="text-orange-500" />, link: "/events/faq" },
  ],
};