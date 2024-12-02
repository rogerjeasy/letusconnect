"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import SelectCountry from "../forms/SelectCountry";
import { useUserStore } from "../../store/userStore";
import { api } from "../../helpers/api";
import SpinnerUI from "./SpinnerUI";
import ModalPopup from "./ModalPopup";
import { useFetchAddress } from "../../store/useFetchAddress";

export default function UserAddressCard() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const {
    address,
    setAddress,
    addressResponseStatus,
    setAddressResponseStatus,
    fetchAddress,
  } = useFetchAddress(token!);

  const [isUpdating, setIsUpdating] = useState(false)
  const [modalProps, setModalProps] = useState({
    isOpen: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });


  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else {
      fetchAddress();
    }
  }, [isAuthenticated, user, router]);
  
  const handleUpdateField = (field: keyof typeof address, value: string) => {
    
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log("Address:", address);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
        if (addressResponseStatus === 404) {
            // Create a new address
            const response = await api.post("/api/addresses", address, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                setAddressResponseStatus(200);
                setAddress(response.data.address);
                console.log("Address created:", response.data.address);
            }
        } else {
        const response = await api.put(`/api/addresses/${address.id}`, address, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setAddress(response.data.address);
        console.log("Address updated:", response.data);
        }
        
        setModalProps({
            isOpen: true,
            title: "Success",
            content: "Address successfully updated!",
            onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
          });
        setIsUpdating(false);
        setIsEditing(false);
    } catch (error: any) {
            console.error("Failed to save address:", error.response?.data?.error || error);
            setModalProps({
                isOpen: true,
                title: "Oops!",
                content: `Failed to save address. Please try again. ${error.response?.data?.error || error?.message}`,
                onConfirm: () => setModalProps({ ...modalProps, isOpen: false }),
            });
    } finally {
        setIsUpdating(false);
      }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
      {/* Header */}
      <CardHeader className="flex justify-between items-center">
        <div>
          <p className="text-md font-bold">Current Address</p>
        </div>
        <Button size="sm" variant="flat" color="primary" onPress={toggleEdit}>
          {isEditing ? "Editing..." : "Update Address"}
        </Button>
      </CardHeader>
      <Divider />
      {/* Body */}
      <CardBody>
        {/* First Row: Country, State, City */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <SelectCountry
                selectionMode="country"
                defaultValue={address.country}
                onChange={(value) => {
                    console.log("Selected Country (from SelectCountry):", value); // Direct log here
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
                value={address.state}
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
                value={address.city}
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
                value={address.postalCode}
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
                value={address.houseNumber}
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
                value={address.apartment}
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
                value={address.street}
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
                value={address.region}
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
