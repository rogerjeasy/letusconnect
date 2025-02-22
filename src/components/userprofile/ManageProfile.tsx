"use client";

import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
// import UserAddressCard from "../forms/UserAddressCard";
import UserProfileCard from "../forms/UserProfileCard";
import UserWorkExperienceComponent from "./UserWorkExperienceComponent";
import { useUserStore } from "../../store/userStore";
import UserEducationComponent from "./EducationCard";
import UserProfileSettingWhileLoading from "./UserProfileSettingWhileLoading";

export default function ManageUser() {
  const user = useUserStore((state) => state.user);

  if (!user) 
    return (
      <UserProfileSettingWhileLoading />
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <Card
        className="w-full max-w-4xl mx-auto mt-10 flex flex-col items-center"
        style={{ backgroundColor: "#ECEDEE" }}
      >
        <CardHeader className="flex justify-center items-center w-full p-4">
          <p className="text-xl font-bold text-center">Profile Management</p>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-6 items-center p-6 w-full">
          {/* User Profile Card */}
          <div className="w-full max-w-[800px] mx-auto">
            <UserProfileCard />
          </div>
          {/* User Education Card */}
          <div className="w-full max-w-[800px] mx-auto">
            <UserEducationComponent />
          </div>
          {/* User Work Experience Card */}
          <div className="w-full max-w-[800px] mx-auto">
            <UserWorkExperienceComponent />
          </div>
          {/* User Address Card */}
          <div className="w-full max-w-[800px] mx-auto">
            {/* <UserAddressCard /> */}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
