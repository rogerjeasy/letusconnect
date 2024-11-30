"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Avatar } from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";

export default function Dashboard() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card
      className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg rounded-lg"
      isHoverable
      isPressable
    >
      <CardBody className="flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* Avatar */}
        <Avatar
          src={user.profilePicture || ""}
          alt={user.username || "User Avatar"}
          size="lg"
          className="border-2 border-white"
        >
          {!user.profilePicture && user.username?.charAt(0).toUpperCase()}
        </Avatar>

        {/* User Info */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-xl font-bold">
            Welcome, {user.firstName || user.username || "Guest"}!
          </h1>
          <p className="text-sm text-white/80">
            {user.bio || "Let’s connect, mentor, and grow together!"}
          </p>

          {/* Additional Information */}
          {user.role && (
            <p className="text-sm font-medium mt-2">
              Role: <span className="text-white/90">{user.role}</span>
            </p>
          )}
          {/* {user.universityName && (
            <p className="text-sm font-medium">
              University:{" "}
              <span className="text-white/90">{user.universityName}</span>
            </p>
          )} */}
        </div>
      </CardBody>
    </Card>
  );
}