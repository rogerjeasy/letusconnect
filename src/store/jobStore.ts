import { z } from 'zod';

// Enums for consistent validation
export const JobStatusEnum = z.enum([
  'APPLIED', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'HIRED', 'ARCHIVED', "IN_REVIEW"
]);

export const InterviewTypeEnum = z.enum([
  'PHONE', 'VIDEO', 'ONSITE', 'TECHNICAL'
]);

export const ReminderTypeEnum = z.enum([
  'EMAIL', 'SMS', 'NONE'
]);

// Custom URL validator that allows empty strings
const flexibleUrl = z.string().refine(
  (val) => {
    if (!val) return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL format" }
);

// Interview Round Schema
export const InterviewRoundSchema = z.object({
  roundNumber: z.number().int().min(1),
  date: z.date(),
  time: z.string().optional(),
  location: z.string().optional(),
  interviewType: InterviewTypeEnum,
  interviewer: z.string().optional(),
  description: z.string().optional(),
  reminder: ReminderTypeEnum.optional(),
  meetingLink: z.string().url().optional(),
  notes: z.string().optional()
});

// Job Schema
export const JobSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  applicationDate: z.date().default(() => new Date()),
  status: JobStatusEnum.default('APPLIED'),
  salaryRange: z.string().optional(),
  jobType: z.string().optional(),
  jobDescription: z.string().optional(),
  jobPostLink: flexibleUrl.optional(),
  companyWebsite: flexibleUrl.optional(),
  referral: z.string().optional(),
  interviews: z.array(InterviewRoundSchema).optional(),
  offerDetails: z.string().optional(),
  rejectionReason: z.string().optional(),
  followUpDate: z.date().optional(),
  companyRating: z.number().int().min(1).max(5).optional(),
  applicationNotes: z.string().optional()
});

// Job Create/Update Form Schema (can be more lenient)
export const JobCreateSchema = JobSchema.omit({
  id: true,
  userId: true,
}).partial();