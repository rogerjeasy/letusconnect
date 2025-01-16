import * as z from "zod";

export const studyPrograms = [
    // HSLU Programs
    { id: 1, value: "data_science", label: "Applied Information and Data Science - HSLU" },
    { id: 2, value: "business_hslu", label: "Business Administration - HSLU" },
    { id: 3, value: "informatik_hslu", label: "Computer Science - HSLU" },
    { id: 4, value: "engineering_hslu", label: "Engineering and Architecture - HSLU" },
    { id: 5, value: "social_work_hslu", label: "Social Work - HSLU" },
    { id: 6, value: "design_hslu", label: "Design and Art - HSLU" },
    { id: 7, value: "music_hslu", label: "Music - HSLU" },
    { id: 8, value: "artificial_intelligence_hslu", label: "Artificial Intelligence and Machine Learning - HSLU" },
    { id: 9, value: "digital_business_hslu", label: "Digital Business Management - HSLU" },
    { id: 10, value: "architecture_hslu", label: "Architecture - HSLU" },
    { id: 11, value: "interior_design_hslu", label: "Interior Design - HSLU" },
    // Other Swiss Universities
    { id: 12, value: "computer_science_eth", label: "Computer Science - ETH Zürich" },
    { id: 13, value: "medicine_unibas", label: "Medicine - University of Basel" },
    { id: 14, value: "business_unisg", label: "Business Administration - University of St. Gallen" },
    { id: 15, value: "law_unige", label: "Law - University of Geneva" },
    { id: 16, value: "engineering_epfl", label: "Engineering - EPFL Lausanne" },
    { id: 17, value: "psychology_unibe", label: "Psychology - University of Bern" },
    { id: 18, value: "architecture_usi", label: "Architecture - Università della Svizzera Italiana" },
    { id: 19, value: "economics_uzh", label: "Economics - University of Zurich" },
    { id: 20, value: "biology_unifr", label: "Biology - University of Fribourg" },
    { id: 21, value: "chemistry_unilu", label: "Chemistry - University of Lucerne" },
    { id: 22, value: "physics_eth", label: "Physics - ETH Zürich" },
    { id: 23, value: "history_unine", label: "History - University of Neuchâtel" },
    { id: 24, value: "sociology_unil", label: "Sociology - University of Lausanne" },
    { id: 25, value: "mathematics_epfl", label: "Mathematics - EPFL Lausanne" },
    { id: 26, value: "political_science_unige", label: "Political Science - University of Geneva" }
] as const;

// Create a type for the program labels
type ProgramLabel = typeof studyPrograms[number]['label'];

// Create a Zod enum for the program labels
const programLabels = z.enum([
    // HSLU Programs
    "Applied Information and Data Science - HSLU",
    "Business Administration - HSLU",
    "Computer Science - HSLU",
    "Engineering and Architecture - HSLU",
    "Social Work - HSLU",
    "Design and Art - HSLU",
    "Music - HSLU",
    "Artificial Intelligence and Machine Learning - HSLU",
    "Digital Business Management - HSLU",
    "Architecture - HSLU",
    "Interior Design - HSLU",
    // Other Swiss Universities
    "Computer Science - ETH Zürich",
    "Medicine - University of Basel",
    "Business Administration - University of St. Gallen",
    "Law - University of Geneva",
    "Engineering - EPFL Lausanne",
    "Psychology - University of Bern",
    "Architecture - Università della Svizzera Italiana",
    "Economics - University of Zurich",
    "Biology - University of Fribourg",
    "Chemistry - University of Lucerne",
    "Physics - ETH Zürich",
    "History - University of Neuchâtel",
    "Sociology - University of Lausanne",
    "Mathematics - EPFL Lausanne",
    "Political Science - University of Geneva"
]);

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
  program: programLabels
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;