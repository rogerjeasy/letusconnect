"use client";

import { Card, CardHeader, CardBody, CardFooter, Button, Avatar } from "@nextui-org/react";
import { FaUsers } from "react-icons/fa";

const groups = [
  {
    name: "AI Enthusiasts",
    memberCount: 150,
    activityLevel: "High",
    icon: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Data Science Club",
    memberCount: 200,
    activityLevel: "Moderate",
    icon: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Startup Founders",
    memberCount: 100,
    activityLevel: "Low",
    icon: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

export default function HighlightedGroupsDashboard() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Highlighted Groups
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <Card key={index} isHoverable className="transition-transform hover:scale-105 shadow-lg">
              <CardHeader className="flex items-center gap-4">
                <Avatar src={group.icon} size="lg" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.memberCount} Members
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">
                  Activity Level:{" "}
                  <span
                    className={`font-bold ${
                      group.activityLevel === "High"
                        ? "text-green-600"
                        : group.activityLevel === "Moderate"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {group.activityLevel}
                  </span>
                </p>
              </CardBody>
              <CardFooter className="flex justify-center">
                <Button
                  className="bg-blue-600 text-white font-bold hover:bg-blue-700"
                  size="sm"
                >
                  Join Group
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}