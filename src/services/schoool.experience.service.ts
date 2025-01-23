"use client";
import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { toast } from "react-toastify";
import { University, UserSchoolExperience } from "@/store/userStore";
import { AxiosError } from "axios";

interface SchoolExperienceResponse {
  data: UserSchoolExperience;
  error?: string;
}

export const createSchoolExperience = async (
): Promise<UserSchoolExperience> => {
  try {
    const response = await api.post<SchoolExperienceResponse>(
      API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.CREATE
    );
    
    const createdExperience = response.data.data;
    return createdExperience;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to create school experience: " + errorMessage);
    throw new Error(errorMessage || "Failed to create school experience");
  }
};

export const getSchoolExperience = async (): Promise<UserSchoolExperience | null> => {
    try {
      const response = await api.get<SchoolExperienceResponse>(
        API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.GET_ALL
      );
  
      if (response.data.error === "School experience not found") {
        return null;
      }
  
      if (!response.data.data) {
        throw new Error("No school experience data available");
      }
  
      return response.data.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
      }
  
      const errorMessage = handleError(error);
      toast.error("Failed to fetch school experience: " + errorMessage);
      throw new Error(errorMessage || "Failed to fetch school experience");
    }
  };

export const addUniversity = async (
  university: Omit<University, 'id'>,
): Promise<UserSchoolExperience> => {
  try {
    const response = await api.post<SchoolExperienceResponse>(
      API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.UNIVERSITIES.ADD_ONE_UNIVERSITY,
      university
    );
    
    const updatedExperience = response.data.data;
    return updatedExperience;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add university: " + errorMessage);
    throw new Error(errorMessage || "Failed to add university");
  }
};

// Add multiple universities
export const addBulkUniversities = async (
  universities: Omit<University, 'id'>[],
): Promise<UserSchoolExperience> => {
  try {
    const response = await api.post<SchoolExperienceResponse>(
      API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.UNIVERSITIES.ADD_BULK_UNIVERSITIES,
      { universities }
    );
    
    const updatedExperience = response.data.data;
    console.log("used bulk universities: ", updatedExperience);
    return updatedExperience;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add universities: " + errorMessage);
    throw new Error(errorMessage || "Failed to add universities");
  }
};

// Update university
export const updateUniversity = async (
  id: string,
  updates: Partial<Omit<University, 'id'>>,
): Promise<UserSchoolExperience> => {
  try {
    const response = await api.put<SchoolExperienceResponse>(
      API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.UNIVERSITIES.UPDATE(id),
      updates
    );
    
    const updatedExperience = response.data.data;
    return updatedExperience;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to update university: " + errorMessage);
    throw new Error(errorMessage || "Failed to update university");
  }
};

export const deleteUniversity = async (id: string): Promise<UserSchoolExperience> => {
    try {
        console.log("deleteUniversity id: ", id);
      const response = await api.delete<SchoolExperienceResponse>(
        API_CONFIG.ENDPOINTS.SCHOOL_EXPERIENCES.UNIVERSITIES.DELETE(id)
      );
      toast.success("University deleted successfully");
      return response.data.data;
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error("Failed to delete university: " + errorMessage);
      throw new Error(errorMessage || "Failed to delete university");
    }
  };