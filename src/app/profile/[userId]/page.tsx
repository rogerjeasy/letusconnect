"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/userprofile/UserProfileComponent";
import { api, handleError } from "@/helpers/api";
import { useEffect, useState } from "react";
import { User } from "@/store/userStore";
import UserProfileWhileLoading from "@/components/userprofile/UserProfileWhileLoading";
import { getUserByUid } from "@/services/users.services";

const ProfilePage = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState<User | null>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const user = await getUserByUid(userId as string);
          setUserDetails(user);
        } catch (error) {
          const errorMessage = handleError(error);
          console.error('Error fetching profile:', errorMessage);
        }
      };
  
      if (userId) fetchUserProfile();
    }, [userId]);
  
    if (!userDetails) return <UserProfileWhileLoading />;
  
    return <UserProfile user={userDetails} />;
  };

export default ProfilePage;