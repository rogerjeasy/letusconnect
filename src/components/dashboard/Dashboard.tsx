"use client";

import { useEffect } from "react";
import { Card, CardBody, Avatar, Spinner } from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";
import AccessDenied from "@/components/accessdenied/AccessDenied";
import HeroSectionDashboard from "./HeroSectionDashboard";
import QuickStatsDashboard from "./QuickStatsDashboard";
import RecommendationDashboard from "./RecommendationDashboard";
import ActivityFeedDashboard from "./ActivityFeedDashboard";
import PersonalizedResourcesDashboard from "./PersonalizedResourcesDashboard";
import HighlightedGroupsDashboard from "./HighlightedGroupsDashboard";

export default function Dashboard() {
  const { user, isAuthenticated, loading, restoreUser } = useUserStore();

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-8"> {/* Added top and horizontal padding */}
      <AccessDenied
        condition={!isAuthenticated || !user}
        message="Access Denied: You need to be logged in to view this page."
      />

      {isAuthenticated && user && (
        <>
          <HeroSectionDashboard />
          <QuickStatsDashboard />
          <RecommendationDashboard />
          <ActivityFeedDashboard />
          <HighlightedGroupsDashboard />
          <PersonalizedResourcesDashboard />
        </>
      )}
    </div>
  );
}
