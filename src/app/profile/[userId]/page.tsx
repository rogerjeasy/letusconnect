"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/userprofile/UserProfileComponent";
import { api, handleError } from "@/helpers/api";
import { useEffect, useState } from "react";
import { User } from "@/store/userStore";

const ProfilePage = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState<User | null>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await api.get(`/api/users/${userId}`);
          setUserDetails(response.data.user);
        } catch (error) {
          const errorMessage = handleError(error);
          console.error('Error fetching profile:', errorMessage);
        }
      };
  
      if (userId) fetchUserProfile();
    }, [userId]);
  
    if (!userDetails) return <div>Loading...</div>;
  
    return <UserProfile user={userDetails} />;
  };

export default ProfilePage;