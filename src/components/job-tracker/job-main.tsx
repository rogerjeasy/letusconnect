"use client";

import { useUserStore } from "@/store/userStore";
import JobTrackerAuth from "./job-auth-users";
import { JobTrackerNoAuth } from "./job-non-auth";

export function JobTrackerMain() {
  const user = useUserStore((state) => state.user);

  return user ? <JobTrackerAuth /> : <JobTrackerNoAuth />;
}