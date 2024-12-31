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

interface MentorshipOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Non-Authenticated Users: Mentorship
export const mentorshipNonAuthComponents: MentorshipOption[] = [
  {
    title: "Explore Mentors",
    href: "/mentorship",
    description: "Discover mentors from diverse industries who can guide and support you.",
    icon: <FaSearch className="text-teal-500" />,
  },
  {
    title: "How It Works",
    href: "/mentorship/how-it-works",
    description: "Learn how the mentorship program operates and how you can get started.",
    icon: <FaSeedling className="text-green-500" />,
  },
  {
    title: "Why Mentorship Matters",
    href: "/mentorship/why-mentorship",
    description: "Understand the value and impact of mentorship in personal and professional growth.",
    icon: <FaBullseye className="text-blue-500" />,
  },
  {
    title: "Upcoming Mentorship Events",
    href: "/mentorship/upcoming-events",
    description: "Check out upcoming events and workshops focused on mentorship opportunities.",
    icon: <FaCalendarAlt className="text-purple-500" />,
  },
  {
    title: "Mentorship Resources",
    href: "/resources",
    description: "Access valuable resources, articles, and tools to enhance your mentorship journey.",
    icon: <FaBookOpen className="text-orange-500" />,
  },
  {
    title: "Success Stories",
    href: "/mentorship/success-stories",
    description: "Get inspired by stories of successful mentorship connections and outcomes.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Join Our Community",
    href: "/mentorship/community",
    description: "Become part of a growing community of mentors and mentees.",
    icon: <FaUserPlus className="text-cyan-500" />,
  },
];

// Authenticated Users: Mentorship
export const mentorshipAuthComponents: MentorshipOption[] = [
  {
    title: "Find a Mentor / Mentee",
    href: "/mentorship/find",
    description: "Browse and connect with mentors or mentees that match your goals.",
    icon: <FaSearch className="text-teal-500" />,
  },
  {
    title: "Schedule a Session",
    href: "/mentorship/schedule",
    description: "Book one-on-one mentorship sessions tailored to your needs.",
    icon: <FaCalendarAlt className="text-blue-500" />,
  },
  {
    title: "My Mentorship Dashboard",
    href: "/mentorship/dashboard",
    description: "Manage your mentorship connections, track sessions, and access tools.",
    icon: <FaClipboardList className="text-purple-500" />,
  },
  {
    title: "Messages & Notifications",
    href: "/mentorship/messages",
    description: "Stay updated with messages and notifications from your mentors or mentees.",
    icon: <FaEnvelope className="text-orange-500" />,
  },
  {
    title: "Recommended Matches",
    href: "/mentorship/recommended",
    description: "View personalized mentor or mentee recommendations based on your profile.",
    icon: <FaBullseye className="text-green-500" />,
  },
  {
    title: "Mentorship Resources",
    href: "/mentorship/resources",
    description: "Access exclusive resources and learning materials for mentorship success.",
    icon: <FaBookOpen className="text-indigo-500" />,
  },
  {
    title: "My Success Stories",
    href: "/mentorship/success-stories",
    description: "Celebrate and share your mentorship achievements and milestones.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Switch Role",
    href: "/mentorship/switch-role",
    description: "Seamlessly transition between being a mentor and a mentee.",
    icon: <FaSyncAlt className="text-cyan-500" />,
  },
];
