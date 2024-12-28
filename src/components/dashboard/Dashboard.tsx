"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import HeroSectionDashboard from "./HeroSectionDashboard";
import QuickStatsDashboard from "./QuickStatsDashboard";
import RecommendationDashboard from "./RecommendationDashboard";
import ActivityFeedDashboard from "./ActivityFeedDashboard";
import PersonalizedResourcesDashboard from "./PersonalizedResourcesDashboard";
import HighlightedGroupsDashboard from "./HighlightedGroupsDashboard";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useUserStore();

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-24 md:pt-28 px-4 md:px-8">
        <AccessDenied
          condition={true}
          message="Access Denied: You need to be logged in to view this page."
        />
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-8">
      <HeroSectionDashboard />
      <QuickStatsDashboard />
      <RecommendationDashboard />
      <ActivityFeedDashboard />
      <HighlightedGroupsDashboard />
      <PersonalizedResourcesDashboard />
    </div>
  );
}