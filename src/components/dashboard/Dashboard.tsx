"use client";

import { useEffect } from "react";
import { Card, CardBody, Avatar, Spinner } from "@nextui-org/react";
import { useUserStore } from "../../store/userStore";
import AccessDenied from "@/components/accessdenied/AccessDenied";

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
        <Card
          className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg rounded-lg"
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
                  Role(s): <span className="text-white/90">{user.role?.join(", ")}</span>
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
