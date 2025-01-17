"use client";

import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast"
import { Briefcase, Camera, GraduationCap, Loader2, MapPin, Users } from "lucide-react";
import type { User, UserSchoolExperience, UserWorkExperience, UserAddress } from '@/store/userStore';
import UserSchoolExperiences from './UserSchoolExperience';
import UserWorkExperiences from './UserWorkExperience';
import UserAddressComponent from './UserAddress';
import UserDetails from './UserDetails';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AvatarFallback, AvatarImage, Avatar } from '../ui/avatar';

const UserProfileComponent = () => {
  const { user, loading: isUserLoading } = useUserStore();
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();

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

  // Update handlers for each section
  const handlePersonalUpdate = async (data: Partial<User>) => {
    try {
      setTabLoading('personal', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
    } catch (error) {
      console.error('Error updating personal information:', error);
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive",
      });
    } finally {
      setTabLoading('personal', false);
    }
  };

  const handleEducationUpdate = async (data: UserSchoolExperience) => {
    try {
      setTabLoading('education', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Success",
        description: "Education history updated successfully",
      });
    } catch (error) {
      console.error('Error updating education history:', error);
      toast({
        title: "Error",
        description: "Failed to update education history",
        variant: "destructive",
      });
    } finally {
      setTabLoading('education', false);
    }
  };

  const handleWorkUpdate = async (data: UserWorkExperience) => {
    try {
      setTabLoading('work', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Success",
        description: "Work history updated successfully",
      });
    } catch (error) {
      console.error('Error updating work history:', error);
      toast({
        title: "Error",
        description: "Failed to update work history",
        variant: "destructive",
      });
    } finally {
      setTabLoading('work', false);
    }
  };

  const handleAddressUpdate = async (data: UserAddress) => {
    try {
      setTabLoading('address', true);
      // Implement your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive",
      });
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
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
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
// "use client";
// import React, { useState } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import UserDetails from './UserDetails';
// import UserSchoolExperiences from './UserSchoolExperience';
// import UserAddressComponent from './UserAddress';
// import UserWorkExperiences from './UserWorkExperience';
// import { 
//   Users, 
//   Briefcase, 
//   GraduationCap, 
//   MapPin, 
//   Loader2, 
//   Camera
// } from "lucide-react";
// import { Users as UserIcon } from "lucide-react";
// import { toast } from '@/hooks/use-toast';
// import { User, UserAddress, UserSchoolExperience, UserWorkExperience, useUserStore } from '@/store/userStore';

// const UserProfileComponent = () => {
//   const [activeTab, setActiveTab] = useState("personal");
//   const { user, loading: isUserLoading } = useUserStore();
//   const [loadingStates, setLoadingStates] = useState({
//     personal: false,
//     education: false,
//     work: false,
//     address: false,
//   });

//   const mockUser = {
//     name: user?.username,
//     email: user?.email,
//     avatar: user?.profilePicture,
//   };

//   const setTabLoading = (tab: string, loading: boolean) => {
//         setLoadingStates(prev => ({
//           ...prev,
//           [tab]: loading
//         }));
//       };

//     // Update handlers for each section
//     const handlePersonalUpdate = async (data: Partial<User >) => {
//         try {
//           setTabLoading('personal', true);
//           // Implement your API call here
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
          
//           toast({
//             title: "Success",
//             description: "Personal information updated successfully",
//           });
//         } catch (error) {
//           console.error('Error updating personal information:', error);
//           toast({
//             title: "Error",
//             description: "Failed to update personal information",
//             variant: "destructive",
//           });
//         } finally {
//           setTabLoading('personal', false);
//         }
//       };
    
//       const handleEducationUpdate = async (data: UserSchoolExperience) => {
//         try {
//           setTabLoading('education', true);
//           // Implement your API call here
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
          
//           toast({
//             title: "Success",
//             description: "Education history updated successfully",
//           });
//         } catch (error) {
//           console.error('Error updating education history:', error);
//           toast({
//             title: "Error",
//             description: "Failed to update education history",
//             variant: "destructive",
//           });
//         } finally {
//           setTabLoading('education', false);
//         }
//       };
    
//       const handleWorkUpdate = async (data: UserWorkExperience) => {
//         try {
//           setTabLoading('work', true);
//           // Implement your API call here
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
          
//           toast({
//             title: "Success",
//             description: "Work history updated successfully",
//           });
//         } catch (error) {
//           console.error('Error updating work history:', error);
//           toast({
//             title: "Error",
//             description: "Failed to update work history",
//             variant: "destructive",
//           });
//         } finally {
//           setTabLoading('work', false);
//         }
//       };
    
//       const handleAddressUpdate = async (data: UserAddress) => {
//         try {
//           setTabLoading('address', true);
//           // Implement your API call here
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
          
//           toast({
//             title: "Success",
//             description: "Address updated successfully",
//           });
//         } catch (error) {
//           console.error('Error updating address:', error);
//           toast({
//             title: "Error",
//             description: "Failed to update address",
//             variant: "destructive",
//           });
//         } finally {
//           setTabLoading('address', false);
//         }
//       };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container max-w-6xl mx-auto px-4">
        // <div className="mb-8 space-y-4">
        //   <div className="flex items-center justify-between">
        //     <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        //     <Button variant="outline">
        //       <Camera className="h-4 w-4 mr-2" />
        //       Change Photo
        //     </Button>
        //   </div>
          
        //   <Card>
        //     <CardContent className="p-6">
        //       <div className="flex items-center space-x-6">
        //         <Avatar className="h-24 w-24">
        //           <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
        //           <AvatarFallback>JD</AvatarFallback>
        //         </Avatar>
        //         <div>
        //           <h2 className="text-2xl font-semibold">{mockUser.name}</h2>
        //           <p className="text-gray-500">{mockUser.email}</p>
        //         </div>
        //       </div>
        //     </CardContent>
        //   </Card>
        // </div>

//         <Card className="mt-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="w-full justify-start gap-4 rounded-none border-b bg-transparent p-0">
//               <TabsTrigger
//                 value="personal"
//                 disabled={loadingStates.personal}
//                 className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
//               >
//                 <Users className="h-4 w-4 mr-2" />
//                 Personal Info
//                 {loadingStates.personal && (
//                   <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                 )}
//               </TabsTrigger>
//               <TabsTrigger
//                 value="education"
//                 disabled={loadingStates.education}
//                 className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
//               >
//                 <GraduationCap className="h-4 w-4 mr-2" />
//                 Education
//                 {loadingStates.education && (
//                   <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                 )}
//               </TabsTrigger>
//               <TabsTrigger
//                 value="work"
//                 disabled={loadingStates.work}
//                 className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
//               >
//                 <Briefcase className="h-4 w-4 mr-2" />
//                 Work History
//                 {loadingStates.work && (
//                   <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                 )}
//               </TabsTrigger>
//               <TabsTrigger
//                 value="address"
//                 disabled={loadingStates.address}
//                 className="relative h-11 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
//               >
//                 <MapPin className="h-4 w-4 mr-2" />
//                 Address
//                 {loadingStates.address && (
//                   <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                 )}
//               </TabsTrigger>
//             </TabsList>

//             <ScrollArea className="h-[600px]">
//               <div className="p-6">
//                 <TabsContent value="personal" className="mt-0 space-y-4">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Personal Information</h3>
//                     <div className="text-sm text-muted-foreground">
//                       Update your personal details and how others see you on the platform.
//                     </div>
//                     <UserDetails user={user} onUpdate={handlePersonalUpdate} />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="education" className="mt-0 space-y-4">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Education History</h3>
//                     <div className="text-sm text-muted-foreground">
//                       Add or update your educational background and academic achievements.
//                     </div>
//                         <UserSchoolExperiences 
//                             schoolExperience={null} // Replace with actual data
//                             onUpdate={handleEducationUpdate}
//                         />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="work" className="mt-0 space-y-4">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Work Experience</h3>
//                     <div className="text-sm text-muted-foreground">
//                       Manage your professional experience and career history.
//                     </div>
//                         <UserWorkExperiences 
//                             workExperience={null} // Replace with actual data
//                             onUpdate={handleWorkUpdate}
//                         />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="address" className="mt-0 space-y-4">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Address Information</h3>
//                     <div className="text-sm text-muted-foreground">
//                       Update your current address and contact information.
//                     </div>
//                         <UserAddressComponent 
//                             address={null}
//                             onUpdate={handleAddressUpdate}
//                         />
//                   </div>
//                 </TabsContent>
//               </div>
//             </ScrollArea>
//           </Tabs>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default UserProfileComponent;