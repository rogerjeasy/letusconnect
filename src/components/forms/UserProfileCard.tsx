"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Avatar,
} from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import TextareaForm from "../forms/TextArea";
import SelectCountry from "../forms/SelectCountry";
import { useUserStore } from "../../store/userStore";
import { useUserLanguageStore } from "@/store/userLanguageStore";
import { api } from "../../helpers/api";
import Scroll from "./Scroll";

export default function UserProfileCard() {
  const { user, isAuthenticated, setUser } = useUserStore();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const { languageOptions, setSelectedLanguage } = useUserLanguageStore();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ ...user });
  const [originalProfile, setOriginalProfile] = useState({ ...user });

//   const userSpokenLanguages = profile.languages
//     ? profile.languages.map((language: string) => {
//         const matchingOption = languageOptions.find(
//           (option) => option.label.toLowerCase() === language.toLowerCase()
//         );
//         return matchingOption
//           ? { value: matchingOption.value, label: matchingOption.label }
//           : null;
//       }).filter((lang) => lang !== null)
//     : [];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  const handleUpdateField = (field: keyof typeof profile, value: string | string[]) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      setProfile({ ...originalProfile }); 
    } else {
      setOriginalProfile({ ...profile }); 
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/api/users/${user?.uid}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response.data, token || "");
        setOriginalProfile(response.data); // Update the original profile
        alert("Profile successfully updated!");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  const handleLanguageChange = (selected: string[]) => {
    const selectedLanguages = languageOptions.filter((option) =>
      selected.includes(option.value)
    );
    selectedLanguages.forEach((language) => {
      setSelectedLanguage({
        code: language.value,
        name: language.label,
      });
    });
    console.log("Selected Languages:", selectedLanguages);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="max-w-[800px] mx-auto">
      {/* Header */}
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar src={profile.profilePicture} alt={profile.username} size="lg" />
          <div>
            <p className="text-md font-bold">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-default-500">{profile.email}</p>
          </div>
        </div>
        <Button size="sm" variant="flat" color="primary" onPress={toggleEdit}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </CardHeader>
      <Divider />
      {/* Body */}
      <CardBody>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <InputForm type="text" label="Your UserID:" defaultValue={profile.uid || ""} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <InputForm type="text" label="Verified Profile" defaultValue={profile.is_verified || false} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <InputForm type="text" label="Created" defaultValue={profile.account_creation_date.split("T")[0] || ""} />
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Username"
                placeholder="Enter username"
                defaultValue={profile.username || ""}
                onChange={(value) => handleUpdateField("username", value)}
              />
            ) : (
              <InputForm type="text" label="Username" defaultValue={profile.username || ""} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="First Name"
                placeholder="Enter first name"
                defaultValue={profile.firstName || ""}
                onChange={(value) => handleUpdateField("firstName", value)}
              />
            ) : (
              <InputForm type="text" label="First Name" defaultValue={profile.firstName || ""} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                defaultValue={profile.lastName || ""}
                onChange={(value) => handleUpdateField("lastName", value)}
              />
            ) : (
              <InputForm type="text" label="Last Name" defaultValue={profile.lastName || ""} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Role"
                placeholder="Enter role"
                defaultValue={profile.role || ""}
                onChange={(value) => handleUpdateField("role", value)}
              />
            ) : (
              <InputForm type="text" label="Role" defaultValue={profile.role || ""} />
            )}
          </div>

          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <SelectCountry
                selectionMode="phone"
                defaultValue={profile.phoneNumber || ""}
                onChange={(selected) => handleUpdateField("phoneNumber", selected)}
              />
            ) : (
              <InputForm type="text" label="Country" defaultValue={profile.phoneNumber || ""} />
            )}
          </div>

          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Phone Number"
                placeholder="Enter phone number"
                defaultValue={profile.phoneNumber || ""}
                onChange={(value) => handleUpdateField("phoneNumber", value)}
              />
            ) : (
              <InputForm type="text" label="Phone Number" defaultValue={profile.phoneNumber || ""} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1">
            {isEditing ? (
              <TextareaForm
              value={profile.bio || ""}
                label="Bio"
                placeholder="Enter your bio"
                description=""
                onChange={(value) => handleUpdateField("bio", value)}
                labelColor="text-black"
              />
            ) : (
              <TextareaForm
                value={profile.bio || ""}
                isReadOnly
                label="Bio"
                variant="faded"
                // defaultValue={profile.bio || ""}
                placeholder=""
                description=""
                labelColor="text-black"
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <Scroll>
                <SelectCountry
                  selectionMode="language"
                  defaultValue={languageOptions.map((option) => option.value)}
                  onChange={(selected) => handleLanguageChange(selected as string[])}
                />
              </Scroll>
            ) : (
              <InputForm
                type="text"
                label="Languages"
                defaultValue={
                  profile.languages && profile.languages.length > 0
                    ? profile.languages.join(", ")
                    : "No languages selected"
                }
              />
            )}
          </div>
        </div>
      </CardBody>
      <Divider />
      {/* Footer */}
      {isEditing && (
        <CardFooter className="flex justify-end gap-4">
          <Button color="primary" onPress={handleSave}>
            Save Changes
          </Button>
          <Button color="danger" variant="flat" onPress={handleCancel}>
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
