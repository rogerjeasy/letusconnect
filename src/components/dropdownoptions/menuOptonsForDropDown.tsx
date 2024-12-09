"use client";

import {
  FaSearch,
  FaCalendarAlt,
  FaClipboardList,
  FaEnvelope,
  FaBullseye,
  FaBookOpen,
  FaStar,
  FaSyncAlt,
  FaSeedling,
  FaUserPlus,
} from "react-icons/fa";

export const mentorshipOptionsForDropDown = {
  mentorshipNonAuthUsers: [
    { label: "Explore Mentors", icon: <FaSearch className="text-teal-500" />, link: "/mentorship" },
    { label: "How It Works", icon: <FaSeedling className="text-green-500" />, link: "/mentorship/how-it-works" },
    { label: "Why Mentorship Matters", icon: <FaBullseye className="text-blue-500" />, link: "/mentorship/why-mentorship" },
    { label: "Upcoming Mentorship Events", icon: <FaCalendarAlt className="text-purple-500" />, link: "/mentorship/upcoming-events" },
    { label: "Mentorship Resources", icon: <FaBookOpen className="text-orange-500" />, link: "/resources" },
    { label: "Success Stories", icon: <FaStar className="text-yellow-500" />, link: "/mentorship/success-stories" },
    { label: "Join Our Community", icon: <FaUserPlus className="text-cyan-500" />, link: "/mentorship/community" },
  ],

  mentorshipAuthUsers: [
    { label: "Find a Mentor / Mentee", icon: <FaSearch className="text-teal-500" />, link: "/mentorship/find" },
    { label: "Schedule a Session", icon: <FaCalendarAlt className="text-blue-500" />, link: "/mentorship/schedule" },
    { label: "My Mentorship Dashboard", icon: <FaClipboardList className="text-purple-500" />, link: "/mentorship/dashboard" },
    { label: "Messages & Notifications", icon: <FaEnvelope className="text-orange-500" />, link: "/mentorship/messages" },
    { label: "Recommended Matches", icon: <FaBullseye className="text-green-500" />, link: "/mentorship/recommended" },
    { label: "Mentorship Resources", icon: <FaBookOpen className="text-indigo-500" />, link: "/mentorship/resources" },
    { label: "My Success Stories", icon: <FaStar className="text-yellow-500" />, link: "/mentorship/success-stories" },
    { label: "Switch Role", icon: <FaSyncAlt className="text-cyan-500" />, link: "/mentorship/switch-role" },
  ],
};