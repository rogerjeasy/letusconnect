"use client";

import { useState } from "react";
import { api, handleError } from "../helpers/api";

export const useFetchAddress = (token: string) => {
  const [address, setAddress] = useState({
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

  const fetchAddress = async () => {
    try {
      const response = await api.get("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Address found, populate the fields
      setAddress(response.data.addresses[0]);
      setAddressResponseStatus(200);
    } catch (error) {
      const errorMessage = handleError(error);
      if (errorMessage.status === 404) {
        setAddressResponseStatus(404);
        console.log("Address not yet created");
      } else {
        console.error("Failed to fetch address:", errorMessage);
      }
    }
  };

  return {
    address,
    setAddress,
    addressResponseStatus,
    setAddressResponseStatus,
    fetchAddress,
  };
};
