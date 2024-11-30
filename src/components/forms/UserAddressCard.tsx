"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@nextui-org/react";
import InputForm from "../forms/InputForm";
import InputToUpdate from "../forms/InputToUpdate";
import SelectCountry from "../forms/SelectCountry";
import { useUserStore } from "../../store/userStore";
import { api } from "../../helpers/api";
import { set } from "zod";
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

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else {
      fetchAddress();
    }
  }, [isAuthenticated, user, router]);

//   const fetchAddress = async () => {
//     try {
//       const response = await api.get("/api/addresses", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//     // Address found, populate the fields
//       setAddress(response.data[0]);
//       setAddressResponseStatus(200);
//     } catch (error: any) {
        
//         if (error.status === 404) {            
//             setAddressResponseStatus(404);
//             console.log("Address not yet created");
//         } else {
//             console.error("Failed to fetch address:", error);
//         }
//     }
//   };
  
  const handleUpdateField = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
        console.log("address status code: ", addressResponseStatus);
        if (addressResponseStatus === 404) {
            // Create a new address
            const response = await api.post("/api/addresses", address, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                setAddressResponseStatus(200);
            }
        } else {
        const response = await api.put(`/api/addresses/${address?.id}`, address, {
            headers: { Authorization: `Bearer ${token}` },
        });
        }
        
      alert("Address successfully updated!");
      setIsEditing(false);
    } catch (error: any) {
            console.error("Failed to save address:", error);
            alert("Failed to save address. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
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
                onChange={(value) => handleUpdateField("country", value as string)}
              />
            ) : (
              <InputForm type="text" label="Country" defaultValue={address.country} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="State"
                placeholder="Enter state"
                defaultValue={address.state}
                onChange={(value) => handleUpdateField("state", value)}
              />
            ) : (
              <InputForm type="text" label="State" defaultValue={address.state} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="City"
                placeholder="Enter city"
                defaultValue={address.city}
                onChange={(value) => handleUpdateField("city", value)}
              />
            ) : (
              <InputForm type="text" label="City" defaultValue={address.city} />
            )}
          </div>
        </div>
        {/* Second Row: Postal Code, House Number, Apartment */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="number"
                label="Postal Code"
                placeholder="Enter postal code"
                defaultValue={address.postalCode}
                onChange={(value) => handleUpdateField("postalCode", value)}
              />
            ) : (
              <InputForm type="text" label="Postal Code" defaultValue={address.postalCode} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="number"
                label="House Number"
                placeholder="Enter house number"
                defaultValue={address.houseNumber}
                onChange={(value) => handleUpdateField("houseNumber", value)}
              />
            ) : (
              <InputForm type="text" label="House Number" defaultValue={address.houseNumber} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Apartment"
                placeholder="Enter apartment"
                defaultValue={address.apartment}
                onChange={(value) => handleUpdateField("apartment", value)}
              />
            ) : (
              <InputForm type="text" label="Apartment" defaultValue={address.apartment} />
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
                defaultValue={address.street}
                onChange={(value) => handleUpdateField("street", value)}
              />
            ) : (
              <InputForm type="text" label="Street" defaultValue={address.street} />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <InputToUpdate
                type="text"
                label="Region"
                placeholder="Enter region"
                defaultValue={address.region}
                onChange={(value) => handleUpdateField("region", value)}
              />
            ) : (
              <InputForm type="text" label="Region" defaultValue={address.region} />
            )}
          </div>
        </div>
      </CardBody>
      <Divider />
      {/* Footer */}
      {isEditing && (
        <CardFooter className="flex justify-end gap-4">
          <Button color="primary" onPress={handleSave}>
            Update
          </Button>
          <Button color="danger" variant="flat" onPress={handleCancel}>
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
