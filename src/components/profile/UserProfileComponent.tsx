"use client";

import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, Camera, GraduationCap, Loader2, MapPin, Users } from "lucide-react";
import type { User, UserSchoolExperience, UserWorkExperience, UserAddress } from '@/store/userStore';
import UserSchoolExperiences from './UserSchoolExperience';
import UserWorkExperiences from './UserWorkExperience';
import UserAddressComponent from './UserAddress';
import UserDetails from './UserDetails';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AvatarFallback, AvatarImage, Avatar } from '../ui/avatar';
import { updateUserPersonalInformation } from '@/services/users.services';
import { toast } from 'react-toastify';
import DevelopmentModal from '../utils/DevelopmentModal';

const UserProfileComponent = () => {
  const { user, loading: isUserLoading, setUser } = useUserStore();
  const [activeTab, setActiveTab] = useState("personal");

  // Track loading state for each section
  const [loadingStates, setLoadingStates] = useState({
    personal: false,
    education: false,
    work: false,
    address: false,
  });

  const setTabLoading = (tab: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [tab]: loading
    }));
  };

  const handlePersonalUpdate = async (data: Partial<User>) => {
    try {
      setTabLoading('personal', true);
      const { user, token } = await updateUserPersonalInformation(data);
      setUser(user, token);

      toast.success("Personal information updated successfully");
    } catch (error) {
      console.error('Error updating personal information:', error);
      toast.error("Failed to update personal information");
    } finally {
      setTabLoading('personal', false);
    }
  };

  const handleEducationUpdate = async (data: UserSchoolExperience) => {
    try {
      setTabLoading('education', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast.success("Education history updated successfully");
    } catch (error) {
      console.error('Error updating education history:', error);
      toast.error("Failed to update education history");
    } finally {
      setTabLoading('education', false);
    }
  };

  const handleWorkUpdate = async (data: UserWorkExperience) => {
    try {
      setTabLoading('work', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast.success("Work history updated successfully")
    } catch (error) {
      console.error('Error updating work history:', error);
      toast.error("Failed to update work history")
    } finally {
      setTabLoading('work', false);
    }
  };

  const handleAddressUpdate = async (data: UserAddress) => {
    try {
      setTabLoading('address', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast.success("Address updated successfully");
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error("Failed to update address");
    } finally {
      setTabLoading('address', false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-5xl mx-auto mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <DevelopmentModal
                buttonText={
                    <>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                    </>
                }
                buttonVariant="outline"
                title="Profile Photo Upload Coming Soon"
                description="We're working on implementing secure profile photo uploads. Soon you'll be able to personalize your profile with a photo of your choice. This feature will include image cropping, size optimization, and easy updating."
                icon="construction"
                />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2>{user.firstName} {user.lastName}</h2>
                  <h2 className="text-2xl font-semibold">{user.username}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
      <div className="w-full max-w-5xl mx-auto">
        <Tabs 
          defaultValue="personal" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="personal" disabled={loadingStates.personal}>
              <Users className="h-4 w-4 mr-2" />
              {loadingStates.personal ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Personal
            </TabsTrigger>
            <TabsTrigger value="education" disabled={loadingStates.education}>
              <GraduationCap className="h-4 w-4 mr-2" />
              {loadingStates.education ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Education
            </TabsTrigger>
            <TabsTrigger value="work" disabled={loadingStates.work}>
              <Briefcase className="h-4 w-4 mr-2" />
              {loadingStates.work ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Work
            </TabsTrigger>
            <TabsTrigger value="address" disabled={loadingStates.address}>
                <MapPin className="h-4 w-4 mr-2" />
              {loadingStates.address ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Address
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[800px]">
            <TabsContent value="personal" className="mt-0">
              <UserDetails 
                user={user}
                onUpdate={handlePersonalUpdate}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <UserSchoolExperiences 
                schoolExperience={null} // Replace with actual data
                onUpdate={handleEducationUpdate}
              />
            </TabsContent>

            <TabsContent value="work" className="mt-0">
              <UserWorkExperiences 
                workExperience={null} // Replace with actual data
                onUpdate={handleWorkUpdate}
              />
            </TabsContent>

            <TabsContent value="address" className="mt-0">
              <UserAddressComponent 
                address={null} // Replace with actual data
                onUpdate={handleAddressUpdate}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfileComponent;