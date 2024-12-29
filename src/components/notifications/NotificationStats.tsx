"use client";

import React from "react";
import { Spinner } from "@nextui-org/react";
import { useNotificationStats } from "./ManagingNotifications";

interface NotificationStatsProps {
  token: string;
}

const NotificationStats: React.FC<NotificationStatsProps> = ({ token }) => {
  const { stats, isLoading, error } = useNotificationStats(token);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading stats</div>;
  }

  if (!stats) {
    return <div className="text-gray-500">No stats available.</div>;
  }

  const rows = [
    { label: "Total", value: stats.totalCount, bgColor: "bg-blue-50" },
    { label: "Unread", value: stats.unreadCount, bgColor: "bg-green-50" },
    { label: "Read", value: stats.readCount, bgColor: "bg-yellow-50" },
    { label: "Archived", value: stats.archivedCount, bgColor: "bg-red-50" },
  ];

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Notification Stats</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-3 border-b border-gray-200 text-blue-800">Metric</th>
            <th className="p-3 border-b border-gray-200 text-blue-800">Count</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={`${row.bgColor} hover:bg-gray-100`}>
              <td className="p-3 border-b border-gray-200 font-medium text-gray-700">
                {row.label}
              </td>
              <td className="p-3 border-b border-gray-200 text-gray-800">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationStats;
