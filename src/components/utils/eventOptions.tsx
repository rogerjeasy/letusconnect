"use client";

import {
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaUsers,
  FaBullhorn,
  FaQuestionCircle,
  FaLightbulb,
  FaGlobe,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";

interface EventsOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Authenticated Users: Events
export const eventsAuthComponents: EventsOption[] = [
  {
    title: "View Events",
    href: "/events/view",
    description: "Browse and explore all events available on the platform.",
    icon: <FaCalendarAlt className="text-blue-500" />,
  },
  {
    title: "My RSVPs",
    href: "/events/rsvps",
    description: "Keep track of the events you've RSVP'd for.",
    icon: <FaCheckCircle className="text-green-500" />,
  },
  {
    title: "Create an Event",
    href: "/events/create",
    description: "Host your own event by creating and sharing it with others.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Hosted Events",
    href: "/events/hosted",
    description: "Manage and track the events you are hosting.",
    icon: <FaUsers className="text-purple-500" />,
  },
  {
    title: "Event Analytics",
    href: "/events/analytics",
    description: "Analyze attendance, engagement, and feedback for your events.",
    icon: <FaChartLine className="text-red-500" />,
  },
  {
    title: "Networking Events",
    href: "/events/networking",
    description: "Participate in events designed for professional networking.",
    icon: <FaHandshake className="text-teal-500" />,
  },
  {
    title: "Global Conferences",
    href: "/events/global",
    description: "Join global events and conferences happening worldwide.",
    icon: <FaGlobe className="text-indigo-500" />,
  },
  {
    title: "Event Insights",
    href: "/events/insights",
    description: "Access insights and tips to maximize your event experience.",
    icon: <FaLightbulb className="text-orange-500" />,
  },
];

// Non-Authenticated Users: Events
export const eventsNonAuthComponents: EventsOption[] = [
  {
    title: "Explore Events",
    href: "/events/explore",
    description: "Discover upcoming events tailored to your interests.",
    icon: <FaCalendarAlt className="text-blue-500" />,
  },
  {
    title: "Upcoming Events",
    href: "/events/upcoming-events",
    description: "Stay updated on the latest events happening soon.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Featured Events",
    href: "/events/featured-event",
    description: "Check out specially curated events featured by the platform.",
    icon: <FaBullhorn className="text-red-500" />,
  },
  {
    title: "Conferences",
    href: "/events/conferences",
    description: "Join conferences to connect with experts in your field.",
    icon: <FaUsers className="text-purple-500" />,
  },
  {
    title: "Community Gatherings",
    href: "/events/community",
    description: "Engage with your community through informal gatherings.",
    icon: <FaHandshake className="text-green-500" />,
  },
  {
    title: "Virtual Events",
    href: "/events/virtual",
    description: "Attend online events and webinars from the comfort of your home.",
    icon: <FaGlobe className="text-teal-500" />,
  },
  {
    title: "Events FAQs",
    href: "/events/faq",
    description: "Find answers to frequently asked questions about events.",
    icon: <FaQuestionCircle className="text-orange-500" />,
  },
];