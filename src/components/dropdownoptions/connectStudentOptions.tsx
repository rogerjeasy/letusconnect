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

export const connectStudentOptions = {
  // Options for Non-Registered Users
  connectNonAuthUsers: [
    {
      label: "Explore Student & Alumni Directory",
      icon: <FaSearch className="text-teal-500" />,
      link: "/users-directory",
    },
    {
      label: "How to Connect",
      icon: <FaComments className="text-green-500" />,
      link: "/connect/how-to",
    },
    {
      label: "Why Connect with Fellow Students?",
      icon: <FaBullseye className="text-blue-500" />,
      link: "/connect/why-connect",
    },
    {
      label: "Upcoming Networking Events",
      icon: <FaCalendarAlt className="text-purple-500" />,
      link: "/events/networking",
    },
    {
      label: "Community Resources",
      icon: <FaBookOpen className="text-orange-500" />,
      link: "/resources",
    },
    {
      label: "Join Our Community",
      icon: <FaUserPlus className="text-cyan-500" />,
      link: "/register",
    },
  ],

  // Options for Logged-In Users
  connectAuthUsers: [
    {
      label: "Find Students & Alumni",
      icon: <FaSearch className="text-teal-500" />,
      link: "/users-directory",
    },
    {
      label: "Upcoming Networking Events",
      icon: <FaCalendarAlt className="text-purple-500" />,
      link: "/events/networking",
    },
    {
      label: "My Connections",
      icon: <FaHandshake className="text-green-500" />,
      link: "/connections",
    },
    {
      label: "Join Groups & Forums",
      icon: <FaUsers className="text-indigo-500" />,
      link: "/groups",
    },
    {
      label: "Create a Group",
      icon: <FaPlusCircle className="text-orange-500" />,
      link: "/groups/create",
    },
    {
      label: "Recommended Connections",
      icon: <FaStar className="text-yellow-500" />,
      link: "/connections/recommended",
    },
  ],
};
