"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { getUserAddresses } from "@/services/address.service";

interface Address {
  id: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  street: string;
  houseNumber: string;
  apartment: string;
  region: string;
}

export const useFetchAddress = () => {
  const [address, setAddress] = useState<Address>({
    country: "",
    state: "",
    city: "",
    postalCode: "",
    street: "",
    houseNumber: "",
    apartment: "",
    region: "",
    id: "",
  });
  const [addressResponseStatus, setAddressResponseStatus] = useState<number | null>(null);

  const fetchAddress = useCallback(async () => {
    try {
      const addresses = await getUserAddresses();
      
      if (addresses && addresses.length > 0) {
        setAddress(addresses[0]);
        setAddressResponseStatus(200);
      } else {
        setAddressResponseStatus(404);
        console.log("Address not yet created");
      }
    } catch (error) {
      setAddressResponseStatus(500);
      console.error("Failed to fetch address:", error);
      toast.error("Failed to fetch address. Please try again later.");
    }
  }, []);

  return {
    address,
    setAddress,
    addressResponseStatus,
    setAddressResponseStatus,
    fetchAddress,
  };
};