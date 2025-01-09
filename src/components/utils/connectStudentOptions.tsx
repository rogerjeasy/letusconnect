"use client";

import {
  FaSearch,
  FaCalendarAlt,
  FaComments,
  FaBullseye,
  FaBookOpen,
  FaUserPlus,
  FaUsers,
  FaHandshake,
  FaStar,
  FaPlusCircle,
} from "react-icons/fa";

interface ConnectOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Options for Non-Registered Users
export const connectNonAuthComponents: ConnectOption[] = [
  {
    title: "Explore Student & Alumni Directory",
    href: "/users-directory",
    description:
      "Browse through our comprehensive directory of students and alumni to find and connect with peers.",
    icon: <FaSearch className="text-teal-500" />,
  },
  {
    title: "How to Connect",
    href: "/connect/how-to",
    description: "Learn the steps to effectively connect with fellow students and alumni.",
    icon: <FaComments className="text-green-500" />,
  },
  {
    title: "Why Connect with Fellow Students?",
    href: "/connect/why-connect",
    description:
      "Discover the benefits of building a strong network with students and alumni.",
    icon: <FaBullseye className="text-blue-500" />,
  },
  {
    title: "Upcoming Networking Events",
    href: "/events/networking",
    description:
      "Join upcoming events to expand your network and meet like-minded individuals.",
    icon: <FaCalendarAlt className="text-purple-500" />,
  },
  {
    title: "Community Resources",
    href: "/resources",
    description:
      "Access valuable resources to help you make meaningful connections within the community.",
    icon: <FaBookOpen className="text-orange-500" />,
  },
  {
    title: "Join Our Community",
    href: "/register",
    description: "Sign up today to start connecting with our vibrant community of students and alumni.",
    icon: <FaUserPlus className="text-cyan-500" />,
  },
];

// Options for Logged-In Users
export const connectAuthComponents: ConnectOption[] = [
  
  {
    title: "My Connections",
    href: "/connections",
    description: "View and manage your connections with students and alumni.",
    icon: <FaHandshake className="text-green-500" />,
  },
  {
    title: "Find Students & Alumni",
    href: "/users-directory",
    description:
      "Search for students and alumni in your field or with shared interests.",
    icon: <FaSearch className="text-teal-500" />,
  },
  {
    title: "Join Groups & Forums",
    href: "/groups",
    description:
      "Participate in groups and forums to engage with communities that interest you.",
    icon: <FaUsers className="text-indigo-500" />,
  },
  {
    title: "Create a Group",
    href: "/groups/create",
    description: "Start your own group to share ideas and collaborate with others.",
    icon: <FaPlusCircle className="text-orange-500" />,
  },
  {
    title: "Upcoming Networking Events",
    href: "/events/networking",
    description:
      "Stay updated on networking events and opportunities to meet your peers.",
    icon: <FaCalendarAlt className="text-purple-500" />,
  },
  {
    title: "Recommended Connections",
    href: "/connections/recommended",
    description:
      "Receive personalized recommendations to connect with students and alumni.",
    icon: <FaStar className="text-yellow-500" />,
  },
];
