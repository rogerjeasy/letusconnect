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
import { api, fileApi, handleError } from "../../helpers/api";
import Scroll from "./Scroll";
import { EditDocumentIcon } from "../icons/EditDocumentIcon";
// import InputDate from "../forms/InputDate";
// import { parseDate } from "@internationalized/date";

export default function UserProfileCard() {
  const { user, isAuthenticated, setUser } = useUserStore();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ ...user });
  const [originalProfile, setOriginalProfile] = useState({ ...user });
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

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
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Failed to update profile:", errorMessage);
      setModalProps({
        isOpen: true,
        title: "Oops!",
        content: `Failed to save profile. Please try again. ${errorMessage}`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
    } finally {
        setIsUpdating(false);
      }
  }; 

  const handleProfilePictureUpdate = async () => {
    if (!selectedImage) return;
    setIsUploading(true);

    const formDataPicture = new FormData();
    formDataPicture.append("file", selectedImage);

    console.log("FormData contents:");
    for (const [key, value] of formDataPicture.entries()) {
      console.log(`${key}:`, value);
    }


    try {
      const response = await fileApi.post(`/api/media-files/upload-images`, formDataPicture, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setProfile((prev) => ({ ...prev, profilePicture: response.data.imageUrl }));
        setModalProps({
          isOpen: true,
          title: "Success",
          content: "Profile picture updated successfully!",
          onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
        });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Failed to update profile picture:", errorMessage);
      setModalProps({
        isOpen: true,
        title: "Oops!",
        content: `Failed to update profile picture. Please try again. ${errorMessage}`,
        onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
      });
    } finally {
      setIsUploading(false);
      setSelectedImage(null);
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
            {isEditing && (
              <div>
                <Button size="sm" variant="flat" color="secondary" onClick={() => document.getElementById('profile-picture-input')?.click()}>
                  Update Profile Picture
                </Button>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                      setSelectedImageName(e.target.files[0].name);
                    }
                  }}
                />
                {selectedImageName && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected: {selectedImageName}</p>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" color="primary" onClick={handleProfilePictureUpdate} disabled={isUploading}>
                        Confirm
                      </Button>
                      <Button size="sm" color="danger" onClick={() => { setSelectedImage(null); setSelectedImageName(null); }} disabled={isUploading}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div>
              <p className="text-md font-bold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-default-500">{profile.email}</p>
            </div>
          </div>
            {/* <Button size="sm" variant="flat" color="primary" onPress={toggleEdit}>
            {isEditing ? "Cancel" : "Edit Profile"}
            </Button> */}

            <Button size="sm" variant="flat" color="primary" onPress={toggleEdit}>
            {isEditing ? (
            <>
                <EditDocumentIcon className="mr-2" />
                Editing...
            </>
            ) : (
            <>
                <EditDocumentIcon className="mr-2" />
                Update Profile
            </>
            )}
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
                value={profile.accountCreatedAt ? profile.accountCreatedAt : "Not specified"} 
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
