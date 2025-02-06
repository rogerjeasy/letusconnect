"use client";

import { api, handleError } from "@/helpers/api";
import { API_CONFIG } from "@/config/api.config";
import { toast } from "react-toastify";
import { z } from "zod";
import { JobSchema, JobCreateSchema, InterviewRoundSchema, JobStatusEnum } from "@/store/jobStore";

interface JobListResponse {
  data: z.infer<typeof JobSchema>[];
}

interface JobCreateResponse {
  data: z.infer<typeof JobSchema>;
  message?: string;
}

interface InterviewRequest {
  jobId: string;
  interviewData: z.infer<typeof InterviewRoundSchema>;
}

/**
 * Fetch all jobs for the current user
 * @returns Promise with array of Jobs
 */
export const getAllJobs = async (): Promise<z.infer<typeof JobSchema>[]> => {
  try {
    const response = await api.get<JobListResponse>(API_CONFIG.ENDPOINTS.JOBS.GET_ALL);
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch jobs");
  }
};

/**
 * Fetch jobs by status
 * @param status Job status to filter
 * @returns Promise with array of Jobs
 */
export const getJobsByStatus = async (status: z.infer<typeof JobStatusEnum>): Promise<z.infer<typeof JobSchema>[]> => {
  try {
    const response = await api.get<JobListResponse>(API_CONFIG.ENDPOINTS.JOBS.GET_BY_STATUS(status));
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || `Failed to fetch jobs with status ${status}`);
  }
};

/**
 * Get a specific job by ID
 * @param jobId ID of the job to retrieve
 * @returns Promise with Job details
 */
export const getJobById = async (jobId: string): Promise<z.infer<typeof JobSchema>> => {
  try {
    const response = await api.get<JobCreateResponse>(API_CONFIG.ENDPOINTS.JOBS.GET_BY_ID(jobId));
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage || "Failed to fetch job details");
  }
};

/**
 * Create a new job
 * @param jobData Job creation data
 * @returns Promise with created Job
 */
export const createJob = async (jobData: z.infer<typeof JobCreateSchema>): Promise<z.infer<typeof JobSchema>> => {
  try {
    const response = await api.post<JobCreateResponse>(API_CONFIG.ENDPOINTS.JOBS.CREATE, jobData);
    
    toast.success(response.data.message || "Job created successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to create job: " + errorMessage);
    throw new Error(errorMessage || "Failed to create job");
  }
};

/**
 * Update an existing job
 * @param jobId ID of the job to update
 * @param jobData Updated job data
 * @returns Promise with updated Job
 */
export const updateJob = async (jobId: string, jobData: z.infer<typeof JobCreateSchema>): Promise<z.infer<typeof JobSchema>> => {
  try {
    const response = await api.put<JobCreateResponse>(API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId), jobData);
    
    toast.success(response.data.message || "Job updated successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to update job: " + errorMessage);
    throw new Error(errorMessage || "Failed to update job");
  }
};

/**
 * Delete a job
 * @param jobId ID of the job to delete
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await api.delete(API_CONFIG.ENDPOINTS.JOBS.DELETE(jobId));
    toast.success("Job deleted successfully");
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to delete job: " + errorMessage);
    throw new Error(errorMessage || "Failed to delete job");
  }
};

/**
 * Add an interview round to a job
 * @param interviewData Interview details and job ID
 * @returns Promise with updated Job
 */
export const addInterviewRound = async (interviewData: InterviewRequest): Promise<z.infer<typeof JobSchema>> => {
  try {
    const response = await api.post<JobCreateResponse>(
      API_CONFIG.ENDPOINTS.JOBS.INTERVIEWS.ADD(interviewData.jobId), 
      interviewData.interviewData
    );
    
    toast.success("Interview round added successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to add interview round: " + errorMessage);
    throw new Error(errorMessage || "Failed to add interview round");
  }
};

/**
 * Remove an interview round from a job
 * @param jobId ID of the job
 * @param roundNumber Number of the interview round to remove
 * @returns Promise with updated Job
 */
export const removeInterviewRound = async (jobId: string, roundNumber: string): Promise<z.infer<typeof JobSchema>> => {
  try {
    const response = await api.delete<JobCreateResponse>(
      API_CONFIG.ENDPOINTS.JOBS.INTERVIEWS.REMOVE(jobId, roundNumber)
    );
    
    toast.success("Interview round removed successfully");
    return response.data.data;
  } catch (error) {
    const errorMessage = handleError(error);
    toast.error("Failed to remove interview round: " + errorMessage);
    throw new Error(errorMessage || "Failed to remove interview round");
  }
};