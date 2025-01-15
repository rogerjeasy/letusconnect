"use client";

export const faqCategories = [
    { key: "getting_started", label: "Getting Started" },
    { key: "about_us", label: "About The Platform" },
    { key: "mentorship", label: "Mentorship" },
    { key: "connecting_students", label: "Connecting with Fellow Students" },
    { key: "events", label: "Events" },
    { key: "resources", label: "Resources and Tools" },
    { key: "career", label: "Career Opportunities" },
    { key: "technical_support", label: "Technical Support" },
    { key: "general", label: "General Inquiries" },
    { key: "alumni_engagement", label: "Alumni Engagement" },
    { key: "project_collaboration", label: "Project Collaboration" },
    { key: "skill_development", label: "Skill Development" },
    { key: "startup_entrepreneurship", label: "Start-up and Entrepreneurship" },
    { key: "global_networking", label: "Global Networking" },
    { key: "cross_disciplinary", label: "Cross-Disciplinary Collaboration" },
    { key: "volunteer_philanthropy", label: "Volunteer and Philanthropy Opportunities" },
    { key: "guest_lectures", label: "Guest Lectures and Expert Panels" },
    { key: "hackathons_competitions", label: "Hackathons and Competitions" },
    { key: "knowledge_sharing", label: "Knowledge Sharing" },
    { key: "regional_networking", label: "Regional and Location-Based Networking" },
    { key: "partner_involvement", label: "Partner and Corporate Involvement" },
    { key: "messaging", label: "Messaging (Real-Time Communication)" },
    { key: "notifications", label: "Notifications and Alerts" },
    { key: "privacy_security", label: "Privacy and Security" },
    { key: "account_settings", label: "Account Settings" },
    { key: "other", label: "Other" },
];

export const faqStatuses = [
    { key: "active", label: "Active" },
    { key: "pending_approval", label: "Pending Approval" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "up_coming", label: "Upcoming" },
    { key: "draft", label: "Draft" },
    { key: "archived", label: "Archived" },
    { key: "deleted", label: "Deleted" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "in_progress", label: "In Progress" },
    { key: "blocked", label: "Blocked" },
    { key: "closed", label: "Closed" },
    
];


export const getLabel = (items: { key: string; label: string }[], key: string): string => {
  const item = items.find(item => item.key === key);
  return item?.label || key;
};