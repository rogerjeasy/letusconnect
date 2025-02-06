import { create } from 'zustand';
import { z } from 'zod';
import { JobStatusEnum } from "@/store/jobStore";
  

// Define the status count type
type StatusCount = {
  name: string;
  count: number;
};

type JobStatusState = {
  statusCounts: Record<z.infer<typeof JobStatusEnum>, StatusCount>;
  
  // Method to update counts based on job operations
  updateStatusCount: (status: z.infer<typeof JobStatusEnum>, change: number) => void;
  
  // Method to set initial counts
  setInitialStatusCounts: (counts: Record<z.infer<typeof JobStatusEnum>, number>) => void;
};

export const useJobStatusStore = create<JobStatusState>((set) => ({
  statusCounts: {
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
  },

  updateStatusCount: (status, change) => {
    set(state => ({
      statusCounts: {
        ...state.statusCounts,
        [status]: {
          ...state.statusCounts[status],
          count: Math.max(0, state.statusCounts[status].count + change)
        }
      }
    }));
  },

  setInitialStatusCounts: (counts) => {
    set(state => ({
      statusCounts: Object.keys(state.statusCounts).reduce((acc, status) => ({
        ...acc,
        [status]: {
          ...state.statusCounts[status as z.infer<typeof JobStatusEnum>],
          count: counts[status as z.infer<typeof JobStatusEnum>] || 0
        }
      }), {} as Record<z.infer<typeof JobStatusEnum>, StatusCount>)
    }));
  }
}));
