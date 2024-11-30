"use client";

import { Card, CardHeader, CardBody, Divider, Button } from "@nextui-org/react";
import UserAddressCard from "../forms/UserAddressCard";
import UserProfileCard from "../forms/UserProfileCard";
import { useUserStore } from "../../store/userStore";
import { useState } from "react";

export default function ManageUser() {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: typeof user) => {
    if (updatedUser) {
      setUser(updatedUser, localStorage.getItem("token") || "");
      alert("User information updated successfully!");
    } else {
      alert("Failed to save user information. Please try again.");
    }
    setIsEditing(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <Card
        className="w-full max-w-4xl mx-auto mt-10 flex flex-col items-center"
        style={{ backgroundColor: "#ECEDEE" }}
      >
        <CardHeader className="flex justify-between items-center w-full p-4">
          <p className="text-xl font-bold text-center">Manage User</p>
          {/* <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => setIsEditing((prev) => !prev)}
          > */}
            {/* {isEditing ? "Cancel" : "Edit Profile"} */}
          {/* </Button> */}
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-6 items-center p-6 w-full">
          {/* User Profile Card */}
          <UserProfileCard/>
          {/* User Address Card */}
          <UserAddressCard />
        </CardBody>
      </Card>
    </div>
  );
}