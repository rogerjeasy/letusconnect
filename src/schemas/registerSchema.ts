import * as z from "zod";

export const studyPrograms = [
  { id: 1, value: "computer_science_eth", label: "Computer Science - ETH Zürich" },
  { id: 2, value: "medicine_unibas", label: "Medicine - University of Basel" },
  { id: 3, value: "business_unisg", label: "Business Administration - University of St. Gallen" },
  { id: 4, value: "law_unige", label: "Law - University of Geneva" },
  { id: 5, value: "engineering_epfl", label: "Engineering - EPFL Lausanne" },
  { id: 6, value: "psychology_unibe", label: "Psychology - University of Bern" },
  { id: 7, value: "architecture_usi", label: "Architecture - Università della Svizzera Italiana" },
  { id: 8, value: "economics_uzh", label: "Economics - University of Zurich" },
  { id: 9, value: "biology_unifr", label: "Biology - University of Fribourg" },
  { id: 10, value: "chemistry_unilu", label: "Chemistry - University of Lucerne" },
  { id: 11, value: "physics_eth", label: "Physics - ETH Zürich" },
  { id: 12, value: "history_unine", label: "History - University of Neuchâtel" },
  { id: 13, value: "sociology_unil", label: "Sociology - University of Lausanne" },
  { id: 14, value: "mathematics_epfl", label: "Mathematics - EPFL Lausanne" },
  { id: 15, value: "political_science_unige", label: "Political Science - University of Geneva" }
] as const;

export type StudyProgram = (typeof studyPrograms)[number];

export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
    .regex(/.*[a-z].*/, "Password must contain at least one lowercase letter")
    .regex(/.*\d.*/, "Password must contain at least one number")
    .regex(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  program: z.string({
    required_error: "Please select a study program",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;