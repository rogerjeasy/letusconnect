"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { FAQ, FAQResponse } from "@/store/faq";

/**
 * Function to create a new FAQ
 * @param data - The FAQ data containing question, response, and category
 * @returns A promise that resolves to the created FAQ response
 */
export const createFAQ = async (data: Partial<FAQ>): Promise<FAQResponse> => {
    try {
      const response = await api.post<FAQResponse>(
        API_CONFIG.ENDPOINTS.FAQ.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to create FAQ");
    }
  };
  
  /**
   * Function to fetch all FAQs
   * @returns A promise that resolves to the FAQs response
   */
  export const getAllFAQs = async (): Promise<FAQ[]> => {
    try {
      const response = await api.get<FAQ[]>(
        API_CONFIG.ENDPOINTS.FAQ.GET_ALL
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to fetch FAQs");
    }
  };
  
  /**
   * Function to fetch a single FAQ by ID
   * @param id - The ID of the FAQ to fetch
   * @returns A promise that resolves to the FAQ response
   */
  export const getFAQById = async (id: string): Promise<FAQ> => {
    try {
      const response = await api.get<FAQ>(
        API_CONFIG.ENDPOINTS.FAQ.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to fetch FAQ");
    }
  };
  
  /**
   * Function to update an existing FAQ
   * @param id - The ID of the FAQ to update
   * @param data - The updated FAQ data
   * @returns A promise that resolves to the updated FAQ response
   */
  export const updateFAQ = async (id: string, data: Partial<FAQ>): Promise<FAQResponse> => {
    try {
      const response = await api.put<FAQResponse>(
        API_CONFIG.ENDPOINTS.FAQ.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to update FAQ");
    }
  };
  
  /**
   * Function to delete a FAQ
   * @param id - The ID of the FAQ to delete
   * @returns A promise that resolves to the deletion response
   */
  export const deleteFAQ = async (id: string): Promise<FAQResponse> => {
    try {
      const response = await api.delete<FAQResponse>(
        API_CONFIG.ENDPOINTS.FAQ.DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw new Error(handleError(error) || "Failed to delete FAQ");
    }
  };