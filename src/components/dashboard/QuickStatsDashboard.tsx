"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { FaUsers, FaComments, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import clsx from "clsx";
import { useUserStore } from "@/store/userStore";
import { useUserConnections } from '../connectstudents/GetUserConnectionNumbers';

const QuickStatsDashboard: React.FC = () => {
  const currentUser = useUserStore((state) => state.user);
  
  const { count: connectionCount, loading: connectionsLoading } = useUserConnections({
    userId: currentUser?.uid || '',
    maxRetries: 3
  });

  const stats = [
    {
      title: "Connections",
      value: connectionsLoading ? "..." : connectionCount.toString(),
      description: "connections made",
      icon: <FaUsers className="text-blue-600" size={40} />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Messages",
      value: "2",
      description: "unread messages",
      icon: <FaComments className="text-green-600" size={40} />,
      bgColor: "bg-green-50",
    },
    {
      title: "Opportunities",
      value: "5",
      description: "new job postings",
      icon: <FaBriefcase className="text-yellow-600" size={40} />,
      bgColor: "bg-yellow-50",
    },
    {
      title: "Events",
      value: "3",
      description: "events this week",
      icon: <FaCalendarAlt className="text-teal-600" size={40} />,
      bgColor: "bg-teal-50",
    },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 lg:px-20 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Quick Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={clsx(
              "flex flex-col justify-center items-center p-6 shadow-md transition-transform hover:scale-105",
              stat.bgColor
            )}
          >
            <CardBody className="flex flex-col items-center text-center">
              {stat.icon}
              <h3 className="text-3xl font-extrabold text-gray-800 mt-4">
                {stat.value}
              </h3>
              <p className="text-lg text-gray-600 mt-2">
                {stat.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default QuickStatsDashboard;