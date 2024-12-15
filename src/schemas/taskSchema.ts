// taskSchema.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must be 20 characters or less." }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(500, { message: "Description must be 50 characters or less." }),
  status: z
    .string()
    .optional()
    .default("todo"),
  priority: z
    .string()
    .optional()
    .default("low"),
  dueDate: z
    .date()
    .optional()
    .default(new Date()),
  assignedTo: z
    .array(
      z.object({
        userId: z.string(),
        username: z.string(),
        role: z.string(),
        email: z.string().email(),
        profilePicture: z.string().url(),
      })
    )
    .optional()
    .default([]),
});
