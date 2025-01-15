import { z } from 'zod';

// Zod schema for form validation
export const createFAQSchema = z.object({
    category: z.string({
        required_error: "Category is required",
    }),
    status: z.string({
        required_error: "Status is required",
    }),
    question: z.string()
        .min(10, "Question must be at least 10 characters long")
        .max(500, "Question must not exceed 500 characters"),
    response: z.string()
        .min(20, "Response must be at least 20 characters long")
        .max(2000, "Response must not exceed 2000 characters"),
});

export type CreateFAQData = z.infer<typeof createFAQSchema>;