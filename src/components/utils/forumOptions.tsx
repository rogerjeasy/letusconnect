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
  FaLightbulb,
  FaNetworkWired,
  FaCommentDots,
} from "react-icons/fa";

interface GroupsOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

// Authenticated Users: Groups
export const groupsAuthComponents: GroupsOption[] = [
  {
    title: "My Groups",
    href: "/groups/my-groups",
    description: "View and manage all the groups you are part of.",
    icon: <FaUsers className="text-blue-500" />,
  },
  {
    title: "Explore Groups",
    href: "/groups/explore",
    description: "Discover groups that align with your interests.",
    icon: <FaSearch className="text-green-500" />,
  },
  {
    title: "Create a Group",
    href: "/groups/create",
    description: "Start your own group and build a community.",
    icon: <FaPlus className="text-purple-500" />,
  },
  {
    title: "Manage My Groups",
    href: "/groups/manage",
    description: "Administer and customize the groups you own.",
    icon: <FaCog className="text-orange-500" />,
  },
  {
    title: "Top Groups",
    href: "/groups/top-groups",
    description: "Explore the most active and popular groups.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Joined Groups",
    href: "/groups/joined",
    description: "Keep track of the groups you’ve joined.",
    icon: <FaUserCheck className="text-teal-500" />,
  },
  {
    title: "Networking Groups",
    href: "/groups/networking",
    description: "Join groups focused on professional networking.",
    icon: <FaNetworkWired className="text-indigo-500" />,
  },
  {
    title: "Discussion Forums",
    href: "/groups/forums",
    description: "Participate in discussions within various forums.",
    icon: <FaCommentDots className="text-red-500" />,
  },
  {
    title: "Group Insights",
    href: "/groups/insights",
    description: "Get analytics and insights on group activities.",
    icon: <FaLightbulb className="text-orange-500" />,
  },
];

// Non-Authenticated Users: Groups
export const groupsNonAuthComponents: GroupsOption[] = [
  {
    title: "Explore Groups/Forums",
    href: "/groups/explore",
    description: "Discover forums and groups open to everyone.",
    icon: <FaSearch className="text-green-500" />,
  },
  {
    title: "Why Join Groups?",
    href: "/groups/why-join",
    description: "Understand the benefits of joining a group or forum.",
    icon: <FaUserFriends className="text-blue-500" />,
  },
  {
    title: "Popular Groups",
    href: "/groups/popular-groups",
    description: "See the most popular groups and forums.",
    icon: <FaStar className="text-yellow-500" />,
  },
  {
    title: "Group Benefits",
    href: "/groups/benefits",
    description: "Learn how joining a group can enhance your experience.",
    icon: <FaUserFriends className="text-teal-500" />,
  },
  {
    title: "Networking Forums",
    href: "/groups/networking",
    description: "Connect with like-minded individuals through forums.",
    icon: <FaNetworkWired className="text-indigo-500" />,
  },
  {
    title: "Community Discussions",
    href: "/groups/community",
    description: "Join discussions in various interest-based communities.",
    icon: <FaCommentDots className="text-red-500" />,
  },
  {
    title: "Groups FAQs",
    href: "/groups/faq",
    description: "Find answers to frequently asked questions about groups.",
    icon: <FaQuestionCircle className="text-orange-500" />,
  },
];