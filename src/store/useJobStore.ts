import { create } from 'zustand';
import { z } from 'zod';
import { JobSchema, JobCreateSchema, JobStatusEnum, InterviewRoundSchema } from "@/store/jobStore";
import * as JobService from '@/services/job.service';
import { useJobStatusStore } from './useJobStatusStore';

type JobState = {
  jobs: z.infer<typeof JobSchema>[];
  selectedJob: z.infer<typeof JobSchema> | null;
  loading: boolean;
  error: string | null;
  
  fetchJobs: () => Promise<void>;
  fetchJobsByStatus: (status: z.infer<typeof JobStatusEnum>) => Promise<void>;
  fetchJobById: (jobId: string) => Promise<void>;
  createJob: (jobData: z.infer<typeof JobCreateSchema>) => Promise<void>;
  updateJob: (jobId: string, jobData: z.infer<typeof JobCreateSchema>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  selectJob: (job: z.infer<typeof JobSchema> | null) => void;
  addInterviewRound: (jobId: string, interviewData: z.infer<typeof InterviewRoundSchema>) => Promise<void>;
  removeInterviewRound: (jobId: string, roundNumber: string) => Promise<void>;
  clearError: () => void;
};

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const jobs = await JobService.getAllJobs();
      
      // Calculate status counts
      const statusCounts = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<z.infer<typeof JobStatusEnum>, number>);
      
      // Set initial status counts
      useJobStatusStore.getState().setInitialStatusCounts(statusCounts);
      
      set({ jobs, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch jobs', 
        loading: false 
      });
    }
  },

  fetchJobsByStatus: async (status) => {
    set({ loading: true, error: null });
    try {
      const jobs = await JobService.getJobsByStatus(status);
      set({ jobs, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : `Failed to fetch jobs with status ${status}`, 
        loading: false 
      });
    }
  },

  fetchJobById: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const job = await JobService.getJobById(jobId);
      set({ selectedJob: job, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch job details', 
        loading: false 
      });
    }
  },

  createJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      const newJob = await JobService.createJob(jobData);
      useJobStatusStore.getState().updateStatusCount(newJob.status, 1);

      set(state => ({ 
        jobs: [...state.jobs, newJob], 
        loading: false 
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to create job', 
        loading: false 
      });
    }
  },

  updateJob: async (jobId, jobData) => {
    set({ loading: true, error: null });
    try {
      const updatedJob = await JobService.updateJob(jobId, jobData);

      // Find the original job to compare status
      const originalJob = get().jobs.find(job => job.id === jobId);
        
      // Update status counts if status changed
      if (originalJob && originalJob.status !== updatedJob.status) {
        useJobStatusStore.getState().updateStatusCount(originalJob.status, -1);
        useJobStatusStore.getState().updateStatusCount(updatedJob.status, 1);
    }

      set(state => ({ 
        jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
        selectedJob: updatedJob,
        loading: false 
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to update job', 
        loading: false 
      });
    }
  },

  deleteJob: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const jobToDelete = get().jobs.find(job => job.id === jobId);
      await JobService.deleteJob(jobId);

      if (jobToDelete) {
        useJobStatusStore.getState().updateStatusCount(jobToDelete.status, -1);
      }

      set(state => ({ 
        jobs: state.jobs.filter(job => job.id !== jobId),
        selectedJob: null,
        loading: false 
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to delete job', 
        loading: false 
      });
    }
  },

  selectJob: (job) => {
    set({ selectedJob: job });
  },

  addInterviewRound: async (jobId, interviewData) => {
    set({ loading: true, error: null });
    try {
      const updatedJob = await JobService.addInterviewRound({ jobId, interviewData });
      set(state => ({ 
        jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
        selectedJob: updatedJob,
        loading: false 
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to add interview round', 
        loading: false 
      });
    }
  },

  removeInterviewRound: async (jobId, roundNumber) => {
    set({ loading: true, error: null });
    try {
      const updatedJob = await JobService.removeInterviewRound(jobId, roundNumber);
      set(state => ({ 
        jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
        selectedJob: updatedJob,
        loading: false 
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to remove interview round', 
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));