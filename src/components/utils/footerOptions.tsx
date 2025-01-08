"use client";

import {
  FaGraduationCap,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaChalkboardTeacher,
  FaBriefcase,
  FaDiscord,
  FaSlack,
  FaSearch,
  FaCalendarAlt,
  FaQuestion,
  FaUserShield,
} from "react-icons/fa";

interface FooterComponent {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

export const footerComponents: FooterComponent[] = [
  {
    title: "Expert Mentorship",
    href: "/features/mentorship",
    description: "Connect with experienced mentors in your field",
    icon: <FaGraduationCap className="text-blue-500" />
  },
  {
    title: "Global Network",
    href: "/features/network",
    description: "Join our worldwide community of professionals",
    icon: <FaUsers className="text-blue-500" />
  },
  {
    title: "Innovation Hub",
    href: "/features/innovation",
    description: "Discover and share innovative ideas",
    icon: <FaLightbulb className="text-blue-500" />
  },
  {
    title: "Collaboration",
    href: "/features/collaboration",
    description: "Work together on exciting projects",
    icon: <FaHandshake className="text-blue-500" />
  },
  {
    title: "Live Workshops",
    href: "/community/workshops",
    description: "Participate in interactive learning sessions",
    icon: <FaChalkboardTeacher className="text-green-500" />
  },
  {
    title: "Job Board",
    href: "/community/jobs",
    description: "Find your next career opportunity",
    icon: <FaBriefcase className="text-green-500" />
  },
  {
    title: "Alumni Network",
    href: "/community/alumni",
    description: "Connect with fellow alumni",
    icon: <FaUsers className="text-green-500" />
  },
  {
    title: "Discord Server",
    href: "/community/discord",
    description: "Join our vibrant Discord community",
    icon: <FaDiscord className="text-green-500" />
  },
  {
    title: "Slack Channel",
    href: "/community/slack",
    description: "Collaborate in our Slack workspace",
    icon: <FaSlack className="text-green-500" />
  },
  {
    title: "Find Alumni",
    href: "/search/alumni",
    description: "Search and connect with alumni",
    icon: <FaSearch className="text-purple-500" />
  },
  {
    title: "Events Calendar",
    href: "/events",
    description: "Stay updated with upcoming events",
    icon: <FaCalendarAlt className="text-purple-500" />
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Access learning materials and tools",
    icon: <FaLightbulb className="text-purple-500" />
  },
  {
    title: "Help Center",
    href: "/help",
    description: "Get support and find answers",
    icon: <FaQuestion className="text-purple-500" />
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Learn about our privacy practices",
    icon: <FaUserShield className="text-red-500" />
  },
  {
    title: "Terms of Service",
    href: "/terms",
    description: "Review our terms and conditions",
    icon: <FaUserShield className="text-red-500" />
  },
  {
    title: "Accessibility",
    href: "/accessibility",
    description: "Learn about our accessibility features",
    icon: <FaUsers className="text-red-500" />
  },
  {
    title: "Contact Support",
    href: "/support",
    description: "Get help from our support team",
    icon: <FaQuestion className="text-red-500" />
  }
];