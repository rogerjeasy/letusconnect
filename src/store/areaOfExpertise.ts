"use client";

export const EXPERTISE_CATEGORIES = {
    DATA_SCIENCE: {
      name: "DATA SCIENCE & ANALYTICS",
      skills: [
        "Data Analysis and Statistics",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing (NLP)",
        "Computer Vision",
        "Big Data Analytics",
        "Predictive Modeling",
        "Time Series Analysis",
        "Data Mining",
        "Statistical Programming"
      ]
    },
    PROGRAMMING: {
      name: "PROGRAMMING & DEVELOPMENT",
      skills: [
        "Python Programming",
        "R Programming",
        "SQL and Database Management",
        "NoSQL Databases",
        "Cloud Computing (AWS, Azure, GCP)",
        "Software Development",
        "Web Development",
        "API Development",
        "Mobile App Development",
        "Version Control Systems"
      ]
    },
    DATA_ENGINEERING: {
      name: "DATA ENGINEERING",
      skills: [
        "Data Pipeline Development",
        "ETL Processes",
        "Data Warehousing",
        "Data Lake Architecture",
        "Stream Processing",
        "Distributed Computing",
        "Data Integration",
        "Database Design",
        "Data Modeling",
        "Performance Optimization"
      ]
    },
    VISUALIZATION: {
      name: "VISUALIZATION & REPORTING",
      skills: [
        "Data Visualization",
        "Business Intelligence",
        "Dashboard Development",
        "Reporting Tools (Tableau, Power BI)",
        "Interactive Visualizations",
        "Information Design",
        "Visual Analytics",
        "Storytelling with Data",
        "UX/UI for Analytics",
        "Presentation Skills"
      ]
    },
    BUSINESS: {
      name: "BUSINESS & DOMAIN EXPERTISE",
      skills: [
        "Business Analytics",
        "Market Analysis",
        "Financial Analytics",
        "Healthcare Analytics",
        "Marketing Analytics",
        "Supply Chain Analytics",
        "Customer Analytics",
        "Risk Analytics",
        "Operations Research",
        "Project Management"
      ]
    },
    EMERGING_TECH: {
      name: "EMERGING TECHNOLOGIES",
      skills: [
        "Artificial Intelligence",
        "Internet of Things (IoT)",
        "Blockchain Analytics",
        "Edge Computing",
        "Quantum Computing",
        "Autonomous Systems",
        "Robotics",
        "Augmented Analytics",
        "MLOps",
        "AutoML"
      ]
    },
    SOFT_SKILLS: {
      name: "SOFT SKILLS & LEADERSHIP",
      skills: [
        "Data Strategy",
        "Team Leadership",
        "Consulting",
        "Communication Skills",
        "Problem-Solving",
        "Critical Thinking",
        "Stakeholder Management",
        "Change Management",
        "Ethics in Data Science",
        "Innovation Management"
      ]
    },
    RESEARCH: {
      name: "RESEARCH & METHODOLOGY",
      skills: [
        "Research Design",
        "Experimental Methods",
        "Survey Methodology",
        "Qualitative Analysis",
        "Quantitative Methods",
        "Academic Writing",
        "Research Publication",
        "Literature Review",
        "Hypothesis Testing",
        "Scientific Communication"
      ]
    },
    INDUSTRY: {
      name: "INDUSTRY-SPECIFIC KNOWLEDGE",
      skills: [
        "FinTech",
        "HealthTech",
        "Smart Cities",
        "Industry 4.0",
        "E-commerce",
        "Digital Transformation",
        "Sustainability Analytics",
        "Educational Technology",
        "Smart Manufacturing",
        "Digital Marketing"
      ]
    }
  } as const;
  
  export type ExpertiseCategory = keyof typeof EXPERTISE_CATEGORIES;

// Updated type definition for skills
export type ExpertiseSkill = typeof EXPERTISE_CATEGORIES[ExpertiseCategory]['skills'][number];

// Updated helper functions
export const getSkillsByCategory = (category: ExpertiseCategory): Array<ExpertiseSkill> => {
  return [...EXPERTISE_CATEGORIES[category].skills];
};

export const getCategoryBySkill = (skill: ExpertiseSkill): ExpertiseCategory | undefined => {
  return Object.entries(EXPERTISE_CATEGORIES).find(
    ([_, category]) => [...category.skills].includes(skill)
  )?.[0] as ExpertiseCategory | undefined;
};

// Helper function to get all skills as a flat array
export const getAllSkills = (): Array<ExpertiseSkill> => {
  return Object.values(EXPERTISE_CATEGORIES).flatMap(category => [...category.skills]);
};

// Helper function to validate if a skill exists
export const isValidSkill = (skill: string): skill is ExpertiseSkill => {
  return getAllSkills().includes(skill as ExpertiseSkill);
};

// Get all categories as an array
export const getAllCategories = (): Array<{key: ExpertiseCategory; name: string}> => {
  return Object.entries(EXPERTISE_CATEGORIES).map(([key, value]) => ({
    key: key as ExpertiseCategory,
    name: value.name
  }));
};

export type ExpertiseValidationError = {
  message: string;
  invalidSkills: string[];
};

// Validate an array of skills
export const validateExpertise = (skills: string[]): ExpertiseValidationError | null => {
  const invalidSkills = skills.filter(skill => !isValidSkill(skill));
  if (invalidSkills.length > 0) {
    return {
      message: `Invalid skills detected: ${invalidSkills.join(", ")}`,
      invalidSkills
    };
  }
  return null;
};