import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { JobSchema, JobCreateSchema, JobStatusEnum, InterviewRoundSchema } from "@/store/jobStore";
import * as JobService from '@/services/job.service';
import { useJobStatusStore } from './useJobStatusStore';

// Define more specific error types
interface JobError {
  message: string;
  code?: string;
  field?: string;
}

type JobState = {
  jobs: z.infer<typeof JobSchema>[];
  selectedJob: z.infer<typeof JobSchema> | null;
  loading: boolean;
  error: JobError | null;
  lastUpdated: Date | null;
  
  // Core job operations
  fetchJobs: () => Promise<void>;
  fetchJobsByStatus: (status: z.infer<typeof JobStatusEnum>) => Promise<void>;
  fetchJobById: (jobId: string) => Promise<void>;
  createJob: (jobData: z.infer<typeof JobCreateSchema>) => Promise<void>;
  updateJob: (jobId: string, jobData: Partial<z.infer<typeof JobCreateSchema>>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  
  // Job selection and state management
  selectJob: (job: z.infer<typeof JobSchema> | null) => void;
  clearError: () => void;
  resetStore: () => void;
  
  // Interview management
  addInterviewRound: (jobId: string, interviewData: z.infer<typeof InterviewRoundSchema>) => Promise<void>;
  removeInterviewRound: (jobId: string, roundNumber: string) => Promise<void>;
  updateInterviewRound: (jobId: string, roundNumber: string, interviewData: Partial<z.infer<typeof InterviewRoundSchema>>) => Promise<void>;
};

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      selectedJob: null,
      loading: false,
      error: null,
      lastUpdated: null,

      fetchJobs: async () => {
        set({ loading: true, error: null });
        try {
          const jobs = await JobService.getAllJobs();
          
          // Calculate and update status counts
          const statusCounts = jobs.reduce((acc, job) => {
            acc[job.status] = (acc[job.status] || 0) + 1;
            return acc;
          }, {} as Record<z.infer<typeof JobStatusEnum>, number>);
          
          useJobStatusStore.getState().setInitialStatusCounts(statusCounts);
          
          set({ 
            jobs, 
            loading: false, 
            lastUpdated: new Date() 
          });
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to fetch jobs',
            code: 'FETCH_ERROR'
          };
          set({ error, loading: false });
        }
      },

      fetchJobsByStatus: async (status) => {
        set({ loading: true, error: null });
        try {
          const jobs = await JobService.getJobsByStatus(status);
          set({ 
            jobs, 
            loading: false,
            lastUpdated: new Date()
          });
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : `Failed to fetch jobs with status ${status}`,
            code: 'STATUS_FETCH_ERROR',
            field: 'status'
          };
          set({ error, loading: false });
        }
      },

      fetchJobById: async (jobId) => {
        set({ loading: true, error: null });
        try {
          const job = await JobService.getJobById(jobId);
          set({ 
            selectedJob: job, 
            loading: false,
            lastUpdated: new Date()
          });
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to fetch job details',
            code: 'JOB_FETCH_ERROR',
            field: 'jobId'
          };
          set({ error, loading: false });
        }
      },

      createJob: async (jobData) => {
        set({ loading: true, error: null });
        try {
          const newJob = await JobService.createJob(jobData);
          
          // Update status count
          useJobStatusStore.getState().updateStatusCount(newJob.status, 1);

          set(state => ({ 
            jobs: [...state.jobs, newJob], 
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to create job',
            code: 'CREATE_ERROR'
          };
          set({ error, loading: false });
        }
      },

      updateJob: async (jobId, jobData) => {
        set({ loading: true, error: null });
        try {
          const originalJob = get().jobs.find(job => job.id === jobId);
          const updatedJob = await JobService.updateJob(jobId, jobData);
          
          // Update status counts if status changed
          if (originalJob && jobData.status && originalJob.status !== jobData.status) {
            useJobStatusStore.getState().updateStatusCount(originalJob.status, -1);
            useJobStatusStore.getState().updateStatusCount(jobData.status, 1);
          }

          set(state => ({ 
            jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
            selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to update job',
            code: 'UPDATE_ERROR',
            field: 'jobId'
          };
          set({ error, loading: false });
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
            selectedJob: state.selectedJob?.id === jobId ? null : state.selectedJob,
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to delete job',
            code: 'DELETE_ERROR',
            field: 'jobId'
          };
          set({ error, loading: false });
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
            selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to add interview round',
            code: 'INTERVIEW_ADD_ERROR'
          };
          set({ error, loading: false });
        }
      },

      removeInterviewRound: async (jobId, roundNumber) => {
        set({ loading: true, error: null });
        try {
          const updatedJob = await JobService.removeInterviewRound(jobId, roundNumber);
          set(state => ({ 
            jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
            selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to remove interview round',
            code: 'INTERVIEW_REMOVE_ERROR'
          };
          set({ error, loading: false });
        }
      },

      updateInterviewRound: async (jobId, roundNumber, interviewData) => {
        set({ loading: true, error: null });
        try {
          const updatedJob = await JobService.updateInterviewRound(jobId, roundNumber, interviewData);
          set(state => ({ 
            jobs: state.jobs.map(job => job.id === jobId ? updatedJob : job),
            selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
            loading: false,
            lastUpdated: new Date()
          }));
        } catch (err) {
          const error: JobError = {
            message: err instanceof Error ? err.message : 'Failed to update interview round',
            code: 'INTERVIEW_UPDATE_ERROR'
          };
          set({ error, loading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetStore: () => {
        set({
          jobs: [],
          selectedJob: null,
          loading: false,
          error: null,
          lastUpdated: null
        });
        useJobStatusStore.getState().resetCounts();
      }
    }),
    {
      name: 'job-store',
      partialize: (state) => ({
        jobs: state.jobs,
        lastUpdated: state.lastUpdated
      })
    }
  )
);

// Optional: Add selector hooks for better performance
export const useJobs = () => useJobStore((state) => state.jobs);
export const useSelectedJob = () => useJobStore((state) => state.selectedJob);
export const useJobLoading = () => useJobStore((state) => state.loading);
export const useJobError = () => useJobStore((state) => state.error);