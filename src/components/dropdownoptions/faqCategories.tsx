"use client"

export const faqCategories = [
    { key: "mentorship", label: "Mentorship" },
    { key: "connecting_students", label: "Connecting with Fellow Students" },
    { key: "events", label: "Events" },
    { key: "resources", label: "Resources and Tools" },
    { key: "career", label: "Career Opportunities" },
    { key: "technical_support", label: "Technical Support" },
    { key: "general", label: "General Inquiries" },
  ];  

export const getCategoryLabel = (categoryKey: string): string => {
  const category = faqCategories.find(cat => cat.key === categoryKey);
  return category?.label || categoryKey; 
};