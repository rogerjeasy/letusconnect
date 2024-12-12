"use client";

import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaCog,
  FaStar,
  FaUserCheck,
  FaUserFriends,
  FaQuestionCircle,
} from "react-icons/fa";

export const groupsOptions = {
  // Authenticated Users: Groups
  groups: [
    { label: "My Groups", icon: <FaUsers className="text-blue-500" />, link: "/groups/my-groups" },
    { label: "Explore Groups", icon: <FaSearch className="text-green-500" />, link: "/groups/explore" },
    { label: "Create a Group", icon: <FaPlus className="text-purple-500" />, link: "/groups/create" },
    { label: "Manage My Groups", icon: <FaCog className="text-orange-500" />, link: "/groups/manage" },
    { label: "Top Groups", icon: <FaStar className="text-yellow-500" />, link: "/groups/top-groups" },
    { label: "Joined Groups", icon: <FaUserCheck className="text-teal-500" />, link: "/groups/joined" },
  ],

  // Non-Authenticated Users: Groups
  groupsNonAuth: [
    { label: "Explore Groups/Forums", icon: <FaSearch className="text-green-500" />, link: "/groups/explore" },
    { label: "Why Join Groups?", icon: <FaUserFriends className="text-blue-500" />, link: "/groups/why-join" },
    { label: "Popular Groups", icon: <FaStar className="text-yellow-500" />, link: "/groups/popular-groups" },
    { label: "Group Benefits", icon: <FaUserFriends className="text-teal-500" />, link: "/groups/benefits" },
    { label: "Groups FAQs", icon: <FaQuestionCircle className="text-orange-500" />, link: "/groups/faq" },
  ],
};