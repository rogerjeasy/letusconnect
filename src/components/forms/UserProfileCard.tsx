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
import SpinnerUI from "./SpinnerUI";
import ModalPopup from "./ModalPopup";
import { useUserStore } from "../../store/userStore";
import { formatFirestoreTimestamp } from "../utils/dateUtils";
import { useUserLanguageStore } from "@/store/userLanguageStore";
import { api } from "../../helpers/api";
import Scroll from "./Scroll";
// import InputDate from "../forms/InputDate";
// import { parseDate } from "@internationalized/date";

export default function UserProfileCard() {
  const { user, isAuthenticated, setUser } = useUserStore();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const { languageOptions, setSelectedLanguage } = useUserLanguageStore();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ ...user });
  const [originalProfile, setOriginalProfile] = useState({ ...user });
  const [isUpdating, setIsUpdating] = useState(false)
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

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
    setIsUpdating(true);

    console.log("Profile to update:", profile);

    try {
      
      const response = await api.put(`/api/users/${user?.uid}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response.data.user, token || "");
        setOriginalProfile(response.data.user);
        setModalProps({
            isOpen: true,
            title: "Success",
            content: "Profile successfully updated!",
            onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
          });
        setIsEditing(false);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setModalProps({
        isOpen: true,
        title: "Oops!",
        content: `Failed to save profile. Please try again. ${error.response?.data?.error || error?.message}`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
    } finally {
        setIsUpdating(false);
      }
  };  

  const handleCancel = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
        {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {isUpdating && <SpinnerUI label="Updating profile..." color="primary" labelColor="primary" />}
            </div>
        )}
        
        <ModalPopup
            title={modalProps.title}
            content={modalProps.content}
            confirmLabel="Close"
            onConfirm={modalProps.onConfirm}
            isOpen={modalProps.isOpen}
        />
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
                <InputForm type="text" label="Your UserID:" value={profile.uid || ""} />
            </div>
            <div className="flex-1 min-w-[200px]">
                <InputForm type="text" label="Verified Profile" value={profile.isVerified ? "Verified" : "Not Verified"} />
            </div>
            <div className="flex-1 min-w-[200px]">
                <InputForm type="text" label="Created" 
                value={formatFirestoreTimestamp(profile.accountCreatedAt)} 
                />
            </div>
            <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                <InputToUpdate
                    type="text"
                    label="Username"
                    placeholder="Enter username"
                    value={profile.username || ""}
                    onChange={(value) => handleUpdateField("username", value)}
                />
                ) : (
                <InputForm type="text" label="Username" value={profile.username || ""} />
                )}
            </div>
            <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                <InputToUpdate
                    type="text"
                    label="First Name"
                    placeholder="Enter first name"
                    value={profile.firstName || ""}
                    onChange={(value) => handleUpdateField("firstName", value)}
                />
                ) : (
                <InputForm type="text" label="First Name" value={profile.firstName || ""} />
                )}
            </div>
            <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                <InputToUpdate
                    type="text"
                    label="Last Name"
                    placeholder="Enter last name"
                    value={profile.lastName || ""}
                    onChange={(value) => handleUpdateField("lastName", value)}
                />
                ) : (
                <InputForm type="text" label="Last Name" value={profile.lastName || ""} />
                )}
            </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
              <InputForm type="text" label="Role" value={profile.role?.join(", ") || "No roles available"} />
            </div>

            <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                <SelectCountry
                    selectionMode="phone"
                    defaultValue={profile.phoneCode || ""}
                    onChange={(selected) => handleUpdateField("phoneCode", selected as string)}
                />
                ) : (
                <InputForm type="text" label="Phone Code" 
                value={
                    profile.phoneCode
                      ? `${profile.phoneCode}`
                      : "No phone code"
                  }
                />
                )}
            </div>

            <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                <InputToUpdate
                    type="text"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={profile.phoneNumber || ""}
                    onChange={(value) => handleUpdateField("phoneNumber", value)}
                />
                ) : (
                <InputForm type="text" label="Phone Number" 
                  value={
                    profile.phoneCode && profile.phoneNumber
                      ? `(${profile.phoneCode}) ${profile.phoneNumber}`
                      : "No phone number available"
                  } 
                />
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
                            defaultValue={profile.languages || []} // Pass current languages as default
                            onChange={(selectedLanguages) => {
                            handleUpdateField("languages", selectedLanguages as string[]); // Update languages in the profile
                            }}
                        />
                        </Scroll>
                    ) : (
                        <InputForm
                        type="text"
                        label="Languages"
                        value={
                            profile.languages && profile.languages.length > 0
                            ? profile.languages.join(", ") // Display selected languages as a comma-separated string
                            : "No languages selected"
                        }
                        />
                    )}
                </div>


                {/* <div className="flex-1 min-w-[200px]">
                    {isEditing ? (
                        <InputDate
                            label="Birth Date"
                            defaultValue={profile.dateOfBirth ? parseDate(profile.dateOfBirth.toString()) : null}
                            onChange={(date) => {
                                if (date) {
                                    handleUpdateField("dateOfBirth", date.toString()); // Update the date in the profile
                                }
                            }}
                        />
                    ) : (
                        <InputForm
                            type="text"
                            label="Birth Date"
                            value={
                                profile.dateOfBirth
                                  ? profile.dateOfBirth.toString() // Convert `DateValue` to string for display
                                  : "Not specified"
                              }
                        />
                    )}
                </div> */}
            </div>
        </CardBody>
        <Divider />
        {/* Footer */}
        {isEditing && (
            <CardFooter className="flex justify-end gap-4">
                <Button color="primary" onPress={handleSave} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button color="danger" variant="flat" onPress={handleCancel} disabled={isUpdating}>
                Cancel
                </Button>
          </CardFooter>
        )}
        </Card>
    </div>
  );
}
