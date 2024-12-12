"use client";

import {
  FaEye,
  FaPlusCircle,
  FaUsers,
  FaTasks,
  FaSearch,
  FaLightbulb,
  FaInfoCircle,
  FaQuestionCircle,
  FaStar,
} from "react-icons/fa";

export const projectsOptions = {
  // Authenticated Users: Projects
  projectsAuth: [
    { label: "View Projects", icon: <FaEye className="text-blue-500" />, link: "/projects/view" },
    { label: "Create a Project", icon: <FaPlusCircle className="text-green-500" />, link: "/projects/create" },
    { label: "Join a Project", icon: <FaUsers className="text-teal-500" />, link: "/projects/join" },
    { label: "Manage Projects", icon: <FaTasks className="text-purple-500" />, link: "/projects/manage" },
  ],

  // Non-Authenticated Users: Projects
  projectsNonAuth: [
    { label: "Explore Projects", icon: <FaSearch className="text-blue-500" />, link: "/projects/explore" },
    { label: "Why Projects Matter", icon: <FaLightbulb className="text-yellow-500" />, link: "/projects/why-projects" },
    { label: "How Projects Work", icon: <FaInfoCircle className="text-teal-500" />, link: "/projects/how-it-works" },
    { label: "Benefits of Projects", icon: <FaStar className="text-orange-500" />, link: "/projects/benefits" },
    { label: "Projects FAQs", icon: <FaQuestionCircle className="text-red-500" />, link: "/projects/faq" },
  ],
};