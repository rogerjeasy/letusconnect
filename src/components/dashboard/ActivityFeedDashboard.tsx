"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FaUsers, FaCalendarAlt, FaBriefcase, FaBullhorn } from "react-icons/fa";
import { useState } from "react";

interface Activity {
  category: "Groups" | "Events" | "Jobs" | "Announcements";
  title: string;
  description: string;
  timestamp: string;
  icon: JSX.Element;
}

const activities: Activity[] = [
  {
    category: "Groups",
    title: "New Post in AI Enthusiasts",
    description: "Alice Johnson shared a post about AI advancements.",
    timestamp: "10 minutes ago",
    icon: <FaUsers className="text-blue-600 text-2xl" />,
  },
  {
    category: "Events",
    title: "Webinar on Data Science Trends",
    description: "Join the live session on modern data practices.",
    timestamp: "1 hour ago",
    icon: <FaCalendarAlt className="text-purple-600 text-2xl" />,
  },
  {
    category: "Jobs",
    title: "New Job Posting: Data Analyst",
    description: "TechCorp is hiring a Data Analyst for their Zurich office.",
    timestamp: "3 hours ago",
    icon: <FaBriefcase className="text-green-600 text-2xl" />,
  },
  {
    category: "Announcements",
    title: "Community Meetup Announced",
    description: "Join us for a casual meetup next Saturday.",
    timestamp: "1 day ago",
    icon: <FaBullhorn className="text-orange-600 text-2xl" />,
  },
  {
    category: "Groups",
    title: "Collaborative Project Proposal",
    description: "Mark Smith suggested a new project idea in Blockchain Research.",
    timestamp: "2 days ago",
    icon: <FaUsers className="text-blue-600 text-2xl" />,
  },
];

export default function ActivityFeedDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const filteredActivities =
    selectedCategory === "All"
      ? activities
      : activities.filter((activity) => activity.category === selectedCategory);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Activity Feed</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="min-w-[200px] bg-white"
            >
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Groups">Groups</SelectItem>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Jobs">Jobs</SelectItem>
              <SelectItem value="Announcements">Announcements</SelectItem>
            </Select>
            <p className="text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-md shadow-sm">
              Selected: <span className="text-blue-600">{selectedCategory}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => (
            <Card
              key={index}
              isHoverable
              className="transition-transform hover:scale-105 shadow-lg"
            >
              <CardHeader className="flex items-center gap-4">
                {activity.icon}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">{activity.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}