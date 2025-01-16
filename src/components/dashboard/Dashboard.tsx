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
import { useStore } from "zustand";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useUserStore();



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }


  return (
    <div>
      <HeroSectionDashboard />
      <QuickStatsDashboard />
      <RecommendationDashboard />
      <ActivityFeedDashboard />
      <HighlightedGroupsDashboard />
      <PersonalizedResourcesDashboard />
    </div>
  );
}