import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { JobStatusEnum } from "@/store/jobStore";
import { useUserStore } from './userStore';

// Define the status count type
type StatusCount = {
  name: string;
  count: number;
};

type JobStatusState = {
  statusCounts: Record<z.infer<typeof JobStatusEnum>, StatusCount>;
  initialized: boolean;
  updateStatusCount: (status: z.infer<typeof JobStatusEnum>, change: number) => void;
  setInitialStatusCounts: (counts: Partial<Record<z.infer<typeof JobStatusEnum>, number>>) => void;
  resetCounts: () => void;
};

const initialStatusCounts: Record<z.infer<typeof JobStatusEnum>, StatusCount> = {
  APPLIED: {
    name: 'Applied',
    count: 0
  },
  IN_REVIEW: {
    name: 'In Review',
    count: 0
  },
  INTERVIEWING: {
    name: 'Interview',
    count: 0
  },
  REJECTED: {
    name: 'Rejected',
    count: 0
  },
  OFFERED: {
    name: 'Offered',
    count: 0
  },
  HIRED: {
    name: 'Hired',
    count: 0
  },
  WITHDRAWN: {
    name: 'Withdrawn',
    count: 0
  },
  ARCHIVED: {
    name: 'Archived',
    count: 0
  }
};

export const useJobStatusStore = create<JobStatusState>()(
  persist(
    (set) => ({
      statusCounts: initialStatusCounts,
      initialized: false,

      updateStatusCount: (status, change) => 
        set((state) => ({
          statusCounts: {
            ...state.statusCounts,
            [status]: {
              ...state.statusCounts[status],
              count: Math.max(0, state.statusCounts[status].count + change)
            }
          }
        })),

      setInitialStatusCounts: (counts) => 
        set((state) => {
          // Create a new status counts object with updated counts
          const updatedCounts = Object.entries(state.statusCounts).reduce(
            (acc, [status, statusObj]) => ({
              ...acc,
              [status]: {
                ...statusObj,
                count: counts[status as z.infer<typeof JobStatusEnum>] || 0
              }
            }),
            {} as Record<z.infer<typeof JobStatusEnum>, StatusCount>
          );

          return {
            statusCounts: updatedCounts,
            initialized: true
          };
        }),

      resetCounts: () => 
        set(() => ({
          statusCounts: initialStatusCounts,
          initialized: false
        }))
    }),
    {
      name: 'job-status-storage',
      partialize: (state) => ({
        statusCounts: state.statusCounts,
        initialized: state.initialized
      })
    }
  )
);

// Optional: Add a selector hook for better performance
export const useStatusCounts = () => useJobStatusStore((state) => state.statusCounts);
export const useJobStatusInitialized = () => useJobStatusStore((state) => state.initialized);
