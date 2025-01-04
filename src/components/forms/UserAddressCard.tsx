"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import { useUserStore } from "../../store/userStore";
import { api, handleError } from "../../helpers/api";
import SpinnerUI from "./SpinnerUI";
import ModalPopup from "./ModalPopup";
import { useFetchAddress } from "../../store/useFetchAddress";
import { EditDocumentIcon } from "../icons/EditDocumentIcon";
import UserSelection from "../forms/SelectCountry";
import { updateUserAddress } from "@/services/address.service";

export default function UserAddressCard() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const { address, setAddress, fetchAddress } = useFetchAddress();

  // Add local form state to handle continuous typing
  const [formData, setFormData] = useState(address);
  const hasFetchedAddress = useRef(false);

  // Update form data when address changes
  useEffect(() => {
    setFormData(address);
  }, [address]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else if (!hasFetchedAddress.current) {
      fetchAddress();
      hasFetchedAddress.current = true;
    }
  }, [isAuthenticated, user, router, fetchAddress]);
  
  // Update the handleUpdateField to use local form state
  const handleUpdateField = (field: keyof typeof address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setFormData(address);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
        const response = await updateUserAddress(address.id, formData, setAddress);
        setAddress(response);        
        setModalProps({
            isOpen: true,
            title: "Success",
            content: "Address successfully updated!",
            onConfirm: () => setModalProps((prev) => ({ ...prev, isOpen: false })),
        });
        setIsUpdating(false);
        setIsEditing(false);
    } catch (error) {
      const errorMessage = handleError(error);
      console.error("Failed to save address:", errorMessage);
      setModalProps({
        isOpen: true,
        title: "Oops!",
        content: `Failed to save address. Please try again. ${errorMessage}`,
        onConfirm: () => setModalProps((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(address);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
        {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <SpinnerUI label="Updating address..." color="primary" labelColor="primary" />
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
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <p className="text-md font-bold">Current Address</p>
            </div>
            <Button size="sm" variant="flat" color="primary" onPress={toggleEdit}>
                {isEditing ? (
                <>
                    <EditDocumentIcon className="mr-2" />
                    Editing...
                </>
                ) : (
                <>
                    <EditDocumentIcon className="mr-2" />
                    Update Address
                </>
                )}
            </Button>
          </CardHeader>

          <Divider />
          <CardBody>
            {/* First Row: Country, State, City */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <UserSelection
                    selectionMode="country"
                    defaultValue={formData.country}
                    onChange={(value) => {
                        handleUpdateField("country", value as string);
                      }}
                  />
                ) : (
                  <InputForm type="text" label="Country" value={address.country} />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="State"
                    placeholder="Enter state"
                    value={formData.state || ""}
                    onChange={(value) => handleUpdateField("state", value)}
                  />
                ) : (
                  <InputForm type="text" label="State" value={address.state} />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="City"
                    placeholder="Enter city"
                    value={formData.city || ""}
                    onChange={(value) => handleUpdateField("city", value)}
                  />
                ) : (
                  <InputForm type="text" label="City" value={address.city} />
                )}
              </div>
            </div>
            {/* Second Row: Postal Code, House Number, Apartment */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="Postal Code"
                    placeholder="Enter postal code"
                    value={formData.postalCode}
                    onChange={(value) => handleUpdateField("postalCode", value)}
                  />
                ) : (
                  <InputForm type="text" label="Postal Code" value={address.postalCode} />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="House Number"
                    placeholder="Enter house number"
                    value={formData.houseNumber}
                    onChange={(value) => handleUpdateField("houseNumber", value)}
                  />
                ) : (
                  <InputForm type="text" label="House Number" value={address.houseNumber} />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="Apartment"
                    placeholder="Enter apartment"
                    value={formData.apartment}
                    onChange={(value) => handleUpdateField("apartment", value)}
                  />
                ) : (
                  <InputForm type="text" label="Apartment" value={address.apartment} />
                )}
              </div>
            </div>
            {/* Third Row: Street, Region */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="Street"
                    placeholder="Enter street"
                    value={formData.street}
                    onChange={(value) => handleUpdateField("street", value)}
                  />
                ) : (
                  <InputForm type="text" label="Street" value={address.street} />
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                {isEditing ? (
                  <InputToUpdate
                    type="text"
                    label="Region"
                    placeholder="Enter region"
                    value={formData.region}
                    onChange={(value) => handleUpdateField("region", value)}
                  />
                ) : (
                  <InputForm type="text" label="Region" value={address.region} />
                )}
              </div>
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
