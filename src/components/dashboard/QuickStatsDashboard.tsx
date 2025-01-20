"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { FaUsers, FaComments, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import clsx from "clsx";
import { useUserStore } from "@/store/userStore";
import { useUserConnections } from '../connectstudents/GetUserConnectionNumbers';
import { useRouter } from 'next/navigation';
import CustomizedTooltip from "../forms/CustomizedTooltip";
import { GetGroupAndDirectUnreadMessages, useUnreadMessages } from '@/components/messages/GetGroupAndDirectUnreadMessages';

type StatAction = {
  buttonText: string;
  tooltipContent: string;
  onClick: () => void;
  buttonColor: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
};

type Stat = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  actions: StatAction[];
};

const QuickStatsDashboard: React.FC = () => {
  const currentUser = useUserStore((state) => state.user);
  const router = useRouter();
  
  const { count: connectionCount, loading: connectionsLoading } = useUserConnections({
    userId: currentUser?.uid || '',
    maxRetries: 3
  });

  const { totalCount: unreadMessagesCount, loading: messagesLoading, error: messagesError } = useUnreadMessages({
    userId: currentUser?.uid ?? '',
    maxRetries: 3
  });

  const stats: Stat[] = [
    {
      title: "Connections",
      value: connectionsLoading ? "..." : connectionCount.toString(),
      description: "connections made",
      icon: <FaUsers className="text-blue-600" size={40} />,
      bgColor: "bg-blue-50",
      actions: [
        {
          buttonText: "View",
          tooltipContent: "Browse and manage your professional network connections",
          onClick: async () => router.push('/connections?status=active'),
          buttonColor: "default"
        },
        {
          buttonText: "Send Request",
          tooltipContent: "Connect with fellow alumni and expand your professional network",
          onClick: async () => router.push('/users-directory'),
          buttonColor: "default"
        }
      ]
    },
    {
      title: "Messages",
      value: messagesLoading 
        ? "0" 
        : messagesError 
        ? "!" 
        : unreadMessagesCount.toString(),
      description: `unread message${unreadMessagesCount !== 1 ? 's' : ''}`,
      icon: <FaComments className="text-green-600" size={40} />,
      bgColor: "bg-green-50",
      actions: [
        {
          buttonText: "View",
          tooltipContent:  "Check your messages",
          onClick: async () => router.push('/chat'),
          buttonColor: "default"
        }
      ]
    },
    {
      title: "Opportunities",
      value: "5",
      description: "new job postings",
      icon: <FaBriefcase className="text-yellow-600" size={40} />,
      bgColor: "bg-yellow-50",
      actions: [
        {
          buttonText: "View",
          tooltipContent: "Explore career opportunities tailored to your profile",
          onClick: () => router.push('/jobs'),
          buttonColor: "default"
        }
      ]
    },
    {
      title: "Events",
      value: "3",
      description: "events this week",
      icon: <FaCalendarAlt className="text-teal-600" size={40} />,
      bgColor: "bg-teal-50",
      actions: [
        {
          buttonText: "View",
          tooltipContent: "Discover upcoming networking events and professional development opportunities",
          onClick: () => router.push('/events'),
          buttonColor: "default"
        }
      ]
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
              <div className="flex flex-row gap-2 mt-4 justify-center items-center w-full">
                {stat.actions.map((action, actionIndex) => (
                  <CustomizedTooltip
                    key={actionIndex}
                    tooltipContent={action.tooltipContent}
                    buttonText={action.buttonText}
                    onClick={action.onClick}
                    buttonColor={action.buttonColor}
                    placement="bottom"
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default QuickStatsDashboard;