"use client";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { menuOptions, DropdownContentItem } from "../../store/menuOptions";
import ViewUserProfile from "../userprofile/ViewProfile";
import Logout from "../userprofile/Logout";
// import { useFetchAddress } from "../../store/useFetchAddress";
import { useUserStore } from "@/store/userStore";

type ProfileDropDownProps = {
  type: "avatar" | "user";
  userDetails: {
    name: string;
    email: string;
    username?: string;
    avatarUrl: string;
    token?: string;
  };
};


const ProfileDropDown: React.FC<ProfileDropDownProps> = ({ type, userDetails }) => {
  const router = useRouter();
  const profileItems: DropdownContentItem[] = menuOptions.Profile;
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const { logout } = useUserStore();

  // Address state management
  // const {
  //   fetchAddress,
  // } = useFetchAddress();

  const handleViewProfile = () => {
    setProfileModalOpen(true);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };
  
  const handleLogoutConfirm = async () => {
    try {
      setLogoutModalOpen(false);
      await logout();
      router.replace("/"); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  

  const handleSettingsRedirect = async () => {
    // await fetchAddress();
    router.push("/settings");
  };

  return (
    <>
      <Dropdown placement={type === "avatar" ? "bottom-end" : "bottom-start"}>
        <DropdownTrigger>
          {type === "avatar" ? (
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src={userDetails.avatarUrl}
            />
          ) : (
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: userDetails.avatarUrl,
              }}
              className="transition-transform"
              description={userDetails.username || ""}
              name={userDetails.name}
            />
          )}
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="signed-in" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{userDetails.email}</p>
          </DropdownItem>
          <>
            {profileItems.map((item) => (
              <DropdownItem
              key={item.key}
              color={item.color}
              onPress={
                item.key === "profile"
                  ? handleViewProfile
                  : item.key === "logout"
                  ? handleLogoutClick
                  : item.key === "settings"
                  ? handleSettingsRedirect
                  : undefined
              }
            >
              {item.href ? (
                <Link href={item.href} className="w-full block">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </DropdownItem>
            
            ))}
          </>
        </DropdownMenu>
      </Dropdown>

      {/* Render the ViewUserProfile Modal */}
      <ViewUserProfile
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Render the Logout Modal */}
      <Logout
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm} 
      />
    </>
  );
};

export default ProfileDropDown;
