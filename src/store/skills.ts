"use client";

export const SKILL_CATEGORIES = {
    TECHNICAL_SKILLS: {
      name: "Technical Skills",
      skills: [
        "Python",
        "JavaScript",
        "TypeScript",
        "Java",
        "C++",
        "C#",
        "Ruby",
        "PHP",
        "Swift",
        "Kotlin",
        "Go",
        "Rust",
        "HTML/CSS",
        "SQL",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "GraphQL",
        "REST APIs",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "GCP",
        "Git",
        "CI/CD",
        "Linux",
        "Node.js",
        "React",
        "Angular",
        "Vue.js",
        "Django",
        "Flask",
        "Spring Boot",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn"
      ]
    },
  
    DATA_SKILLS: {
      name: "Data Skills",
      skills: [
        "Data Analysis",
        "Data Visualization",
        "Statistical Analysis",
        "Data Mining",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Predictive Modeling",
        "A/B Testing",
        "Data Warehousing",
        "ETL",
        "Power BI",
        "Tableau",
        "Excel Advanced",
        "R Programming",
        "SPSS",
        "SAS",
        "Data Cleansing",
        "Feature Engineering"
      ]
    },
  
    SOFT_SKILLS: {
      name: "Soft Skills",
      skills: [
        "Communication",
        "Leadership",
        "Problem Solving",
        "Critical Thinking",
        "Team Management",
        "Project Management",
        "Time Management",
        "Presentation Skills",
        "Public Speaking",
        "Conflict Resolution",
        "Negotiation",
        "Emotional Intelligence",
        "Adaptability",
        "Creativity",
        "Decision Making"
      ]
    },
  
    BUSINESS_SKILLS: {
      name: "Business Skills",
      skills: [
        "Strategic Planning",
        "Business Analysis",
        "Product Management",
        "Agile Methodology",
        "Scrum",
        "Risk Management",
        "Budget Management",
        "Stakeholder Management",
        "Business Development",
        "Marketing Strategy",
        "Financial Analysis",
        "Market Research",
        "Change Management",
        "Process Optimization",
        "Quality Assurance"
      ]
    },
  
    CERTIFICATIONS: {
      name: "Professional Certifications",
      skills: [
        "AWS Certified Solutions Architect",
        "Google Cloud Professional",
        "Microsoft Azure Certified",
        "PMP",
        "CISSP",
        "CompTIA A+",
        "CompTIA Network+",
        "CompTIA Security+",
        "Certified Scrum Master",
        "ITIL Foundation",
        "Six Sigma Green Belt",
        "Six Sigma Black Belt",
        "CFA",
        "CISA",
        "CISM"
      ]
    },
  
    DESIGN_SKILLS: {
      name: "Design & Creative",
      skills: [
        "UI Design",
        "UX Design",
        "Graphic Design",
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe XD",
        "Figma",
        "Sketch",
        "InVision",
        "Prototyping",
        "Typography",
        "Color Theory",
        "Motion Design",
        "3D Modeling",
        "Video Editing"
      ]
    },
  
    INDUSTRY_KNOWLEDGE: {
      name: "Industry Knowledge",
      skills: [
        "Healthcare IT",
        "FinTech",
        "E-commerce",
        "Digital Marketing",
        "Cybersecurity",
        "IoT",
        "Blockchain",
        "Artificial Intelligence",
        "Cloud Computing",
        "Big Data",
        "DevOps",
        "Mobile Development",
        "Web Development",
        "Enterprise Software",
        "Systems Architecture"
      ]
    }
  } as const;
  
  export type SkillCategory = keyof typeof SKILL_CATEGORIES;
export type Skill = (typeof SKILL_CATEGORIES)[SkillCategory]["skills"][number];

// Helper function to get all skills as mutable array
export const getAllSkills = (): Array<Skill> => {
  return Object.values(SKILL_CATEGORIES).flatMap(category => 
    [...category.skills]
  );
};

// Helper function to get category by skill
export const getCategoryBySkill = (skill: Skill): SkillCategory | undefined => {
  return Object.entries(SKILL_CATEGORIES).find(
    ([_, category]) => [...category.skills].includes(skill)
  )?.[0] as SkillCategory | undefined;
};

// Helper function to validate skill
export const isValidSkill = (skill: string): skill is Skill => {
  return getAllSkills().includes(skill as Skill);
};

// Get all categories
export const getAllCategories = (): Array<{key: SkillCategory; name: string}> => {
  return Object.entries(SKILL_CATEGORIES).map(([key, value]) => ({
    key: key as SkillCategory,
    name: value.name
  }));
};

// Helper to get skills by category
export const getSkillsByCategory = (category: SkillCategory): Array<Skill> => {
  return [...SKILL_CATEGORIES[category].skills];
};

// Types for validation
export type SkillValidationError = {
  message: string;
  invalidSkills: string[];
};

// Validate skills array
export const validateSkills = (skills: string[]): SkillValidationError | null => {
  const invalidSkills = skills.filter(skill => !isValidSkill(skill));
  if (invalidSkills.length > 0) {
    return {
      message: `Invalid skills detected: ${invalidSkills.join(", ")}`,
      invalidSkills
    };
  }
  return null;
};