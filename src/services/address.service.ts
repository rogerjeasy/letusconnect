"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

// Interfaces
export interface Address {
  id: string;
  country: string;
  state: string;
  city: string;
  postalCode: number;
  street: string;
  houseNumber: number;
  apartment: string;
  region: string;
}

interface AddressResponse {
  data: Address;
}

interface AddressesResponse {
  data: Address[];
}

export interface AddressUpdateRequest {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: number;
  street?: string;
  houseNumber?: number;
  apartment?: string;
  region?: string;
}

/**
 * Create a new address for the current user
 * @param address - The address details to create
 * @param setAddress - Function to update the address state
 * @returns Promise with the created address
 */
export const createUserAddress = async (
  address: Omit<Address, 'id'>,
  setAddress: Dispatch<SetStateAction<Address>>
): Promise<Address> => {
  try {
    const response = await api.post<AddressResponse>(
      API_CONFIG.ENDPOINTS.ADDRESSES.CREATE,
      address
    );
    
    const createdAddress = response.data.data;
    setAddress(createdAddress);
    return createdAddress;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to create address: " + errorMessage);
    throw new Error(errorMessage || "Failed to create address");
  }
};

/**
 * Update an existing address
 * @param id - The ID of the address to update
 * @param updates - The address fields to update
 * @param setAddress - Function to update the address state
 * @returns Promise with the updated address
 */
export const updateUserAddress = async (
  id: string,
  updates: AddressUpdateRequest,
  setAddress: Dispatch<SetStateAction<Address>>
): Promise<Address> => {
  try {
    const response = await api.put<AddressResponse>(
      API_CONFIG.ENDPOINTS.ADDRESSES.UPDATE(id),
      updates
    );
    
    const updatedAddress = response.data.data;
    setAddress(updatedAddress);
    return updatedAddress;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to update address: " + errorMessage);
    throw new Error(errorMessage || "Failed to update address");
  }
};

/**
 * Get all addresses for the current user
 * @returns Promise with array of addresses
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await api.get<AddressesResponse>(
      API_CONFIG.ENDPOINTS.ADDRESSES.GET_ALL
    );
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to fetch addresses: " + errorMessage);
    throw new Error(errorMessage || "Failed to fetch addresses");
  }
};

/**
 * Delete an address
 * @param id - The ID of the address to delete
 * @param setAddress - Function to update the address state
 */
export const deleteUserAddress = async (
  id: string,
  setAddress: Dispatch<SetStateAction<Address>>
): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.ADDRESSES.DELETE(id));
    
    setAddress({
      country: "",
      state: "",
      city: "",
      postalCode: 0,
      street: "",
      houseNumber: 0,
      apartment: "",
      region: "",
      id: "",
    });
    
    toast.success("Address deleted successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to delete address: " + errorMessage);
    throw new Error(errorMessage || "Failed to delete address");
  }
};