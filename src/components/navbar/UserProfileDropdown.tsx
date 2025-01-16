"use client";

import React, { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  Briefcase,
  Star,
  Heart,
  Bell,
  Link2,
  PenSquare,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import ModalPopup from "@/components/forms/ModalPopup";

export function UserProfileDropdown() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirmation(false);
    router.push("/");
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          {/* Profile and Settings */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={navigateToProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* Networking Features */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/connections")}>
              <Users className="mr-2 h-4 w-4" />
              <span>My Connections</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/mentorship")}>
              <Star className="mr-2 h-4 w-4" />
              <span>Mentorship</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Inbox</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PenSquare className="mr-2 h-4 w-4" />
                    <span>Compose</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* Activity & Resources */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/my-events")}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>My Events</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/my-projects")}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>My Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/saved-resources")}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Saved Resources</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/notifications")}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* Support & Logout */}
          <DropdownMenuItem onClick={() => router.push("/help")}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowLogoutConfirmation(true)} 
            className="text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalPopup
        isOpen={showLogoutConfirmation}
        title="Sign Out Confirmation"
        content={
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to sign out from Let&apos;s Connect?
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll need to sign in again to access your connections, messages, and other features.
            </p>
          </div>
        }
        confirmLabel="Log out"
        cancelLabel="Stay Signed In"
        confirmColor="danger"
        cancelColor="secondary"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirmation(false)}
        showCancelButton={true}
      />
    </>
  );
}