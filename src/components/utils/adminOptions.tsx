"use client";
import {
  FaUserShield,
  FaUsers,
  FaQuestionCircle,
  FaTasks,
  FaCogs,
  FaChartLine,
  FaEnvelopeOpenText,
  FaWrench,
  FaLock,
} from "react-icons/fa";

interface AdminComponent {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

export const adminComponents: AdminComponent[] = [
  {
    title: "User Management",
    href: "/admin/users",
    description: "Manage user accounts, roles, and permissions.",
    icon: <FaUsers className="text-blue-500" />,
  },
  {
    title: "FAQs Management",
    href: "/admin/faqs",
    description: "Create and update frequently asked questions and answers.",
    icon: <FaQuestionCircle className="text-orange-500" />,
  },
  {
    title: "Content Moderation",
    href: "/admin/content-moderation",
    description: "Review and moderate user-generated content.",
    icon: <FaTasks className="text-red-500" />,
  },
  {
    title: "Website Settings",
    href: "/admin/settings",
    description: "Configure and customize website settings and preferences.",
    icon: <FaCogs className="text-purple-500" />,
  },
  {
    title: "Site Analytics",
    href: "/admin/analytics",
    description: "View and analyze website traffic and user behavior.",
    icon: <FaChartLine className="text-green-500" />,
  },
  {
    title: "Email Notifications",
    href: "/admin/email-notifications",
    description: "Manage system email templates and notification settings.",
    icon: <FaEnvelopeOpenText className="text-cyan-500" />,
  },
  {
    title: "System Maintenance",
    href: "/admin/maintenance",
    description: "Perform system maintenance and updates.",
    icon: <FaWrench className="text-gray-500" />,
  },
  {
    title: "Access Control",
    href: "/admin/access-control",
    description: "Configure security settings and access permissions.",
    icon: <FaLock className="text-yellow-500" />,
  },
  {
    title: "Admin Profile",
    href: "/admin/profile",
    description: "Manage your administrator profile and settings.",
    icon: <FaUserShield className="text-teal-500" />,
  },
];