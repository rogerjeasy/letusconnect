"use client";

import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";
import { University, UserSchoolExperience } from "@/store/userStore";

/**
 * Function to fetch user's education details.
 * @param uid - The user's unique identifier
 * @param token - The user authorization token
 * @returns A promise that resolves to the user's school experience data
 */
export const handleGetUserEducation = async (
  token: string
): Promise<UserSchoolExperience | null> => {
  try {
    const response = await api.get(`/api/school-experiences`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to fetch education details");
    return null;
  }
};

/**
 * Function to update a specific university in user's education.
 * @param uid - The user's unique identifier
 * @param universityId - The ID of the university to update
 * @param universityData - The updated university data
 * @param token - The user authorization token
 * @returns A promise that resolves to the updated school experience data
 */
export const handleUpdateUserEducation = async (
  universityId: string,
  universityData: Partial<University>,
  token: string
): Promise<UserSchoolExperience | null> => {
  try {
    const response = await api.put(
      `/api/school-experiences/universities/${universityId}`,
      universityData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Education updated successfully");
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to update education");
    return null;
  }
};

/**
 * Function to delete a university from user's education.
 * @param uid - The user's unique identifier
 * @param universityId - The ID of the university to delete
 * @param token - The user authorization token
 * @returns A promise that resolves to true if deletion was successful
 */
export const handleDeleteUserEducation = async (
  universityId: string,
  token: string
): Promise<boolean> => {
  try {
    await api.delete(`/api/school-experiences/universities/${universityId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Education entry deleted successfully");
    return true;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to delete education entry");
    return false;
  }
};

/**
 * Function to add a new university to user's education.
 * @param uid - The user's unique identifier
 * @param universityData - The new university data
 * @param token - The user authorization token
 * @returns A promise that resolves to the updated school experience data
 */
export const handleAddNewEducation = async (
  universityData: Partial<University>,
  token: string
): Promise<UserSchoolExperience | null> => {
  try {
    const response = await api.post(
      `/api/school-experiences/universities`,
      universityData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("New education entry added successfully");
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to add new education entry");
    return null;
  }
};

/**
 * Function to add multiple universities at once.
 * @param uid - The user's unique identifier
 * @param universitiesData - Array of university data to add
 * @param token - The user authorization token
 * @returns A promise that resolves to the updated school experience data
 */
export const handleAddBulkEducation = async (
  universitiesData: Partial<University>[],
  token: string
): Promise<UserSchoolExperience | null> => {
  try {
    const response = await api.post(
      `/api/school-experiences/universities/bulk`,
      universitiesData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Education entries added successfully");
    return response.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to add education entries");
    return null;
  }
};