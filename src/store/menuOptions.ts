export type DropdownContentItem = {
    key: string;
    label: string;
    href: string;
    color?: string;
  };
  
  export const menuOptions: Record<string, DropdownContentItem[]> = {
    Mentorship: [
      { key: "find", label: "Find a Mentor", href: "/mentorship/find" },
      { key: "manage", label: "Manage Requests", href: "/mentorship/manage" },
      { key: "mentor", label: "Become a Mentor", href: "/mentorship/mentor" },
    ],
    MentorshipNonAuth: [
        { key: "explore", label: "Explore Mentors", href: "mentorship" },
        { key: "why-mentorship", label: "Why Mentorship Matters", href: "/mentorship/why-mentorship" },
        { key: "how-it-works", label: "How Mentorship Works", href: "/mentorship/how-it-works" },
        { key: "benefits", label: "Benefits of Mentorship", href: "/mentorship/benefits" },
        { key: "faq", label: "Mentorship FAQs", href: "/mentorship/faq" },
    ],
    Projects: [
      { key: "view", label: "View Projects", href: "/projects/view" },
      { key: "create", label: "Create a Project", href: "/projects/create" },
      { key: "join", label: "Join a Project", href: "/projects/join" },
      { key: "manage", label: "Manage Projects", href: "/projects/manage" },
    ],
    ProjectsNonAuth: [
        { key: "explore", label: "Explore Projects", href: "/projects/explore" },
        { key: "why-projects", label: "Why Projects Matter", href: "/projects/why-projects" },
        { key: "how-it-works", label: "How Projects Work", href: "/projects/how-it-works" },
        { key: "benefits", label: "Benefits of Projects", href: "/projects/benefits" },
        { key: "faq", label: "Projects FAQs", href: "/projects/faq" },
    ],
    Jobs: [
      { key: "board", label: "Job Board", href: "/jobs/board" },
      { key: "post", label: "Post a Job", href: "/jobs/post" },
    ],
    JobsNonAuth: [
        { key: "explore", label: "Explore Jobs", href: "/jobs/explore" },
        { key: "trending", label: "Trending Jobs", href: "/jobs/trending-jobs" },
        { key: "top-companies", label: "Top Companies Hiring", href: "/jobs/top-companies" },
        { key: "internship", label: "Internship Opportunities", href: "/jobs/internships" },
        { key: "faq", label: "Jobs FAQs", href: "/jobs/faq" },
    ],
    Resources: [
      { key: "learning", label: "Learning Resources", href: "/resources/learning" },
      { key: "contribute", label: "Contribute Resources", href: "/resources/contribute" },
    ],
    Events: [
      { key: "view", label: "View Events", href: "/events/view" },
      { key: "rsvps", label: "My RSVPs", href: "/events/rsvps" },
    ],
    EventsNonAuth: [
        { key: "explore", label: "Explore Events", href: "/events/explore" },
        { key: "upcoming-events", label: "Upcoming Events", href: "/events/upcoming-events" },
        { key: "featured-events", label: "Featured Events", href: "/events/featured-event" },
        { key: "conferences", label: "Conferences", href: "/events/conferences" },
        { key: "faq", label: "Events FAQs", href: "/events/faq" },
    ],
    Groups: [
      { key: "my-groups", label: "My Groups", href: "/groups/my-groups" },
      { key: "explore", label: "Explore Groups", href: "/groups/explore" },
    ],
    Profile: [
      { key: "profile", label: "View Profile", href: "/profile" },
      { key: "settings", label: "My Settings", href: "/settings" },
      { key: "team_settings", label: "Team Settings", href: "/team-settings" },
      { key: "analytics", label: "Analytics", href: "/analytics" },
      { key: "system", label: "System", href: "/system" },
      { key: "configurations", label: "Configurations", href: "/configurations" },
      { key: "help_and_feedback", label: "Help & Feedback", href: "/help" },
      { key: "logout", label: "Log Out", href: "/logout", color: "danger" },
    ],
    About: [
      { key: "about-us", label: "About Us", href: "/about-us" },
      { key: "contact-us", label: "Contact Us", href: "/contact-us" },
      { key: "careers", label: "Careers", href: "/careers" },
      { key: "partnerships", label: "Partnership Opportunities", href: "/partnerships" },
      { key: "faqs", label: "FAQs", href: "/faqs" },
    ],
    Testimonials: [
        { key: "view", label: "View Testimonials", href: "/testimonials/view" },
        { key: "submit", label: "Submit a Testimonial", href: "/testimonials/submit" },
    ],
    TestimonialsNonAuth: [
        { key: "explore", label: "Explore Testimonials", href: "/testimonials/explore" },
        { key: "why-testimonials", label: "Why Testimonials Matter", href: "/testimonials/why-testimonials" },
        { key: "how-it-works", label: "How Testimonials Work", href: "/testimonials/how-it-works" },
        { key: "benefits", label: "Benefits of Testimonials", href: "/testimonials/benefits" },
        { key: "faq", label: "Testimonials FAQs", href: "/testimonials/faq" },
    ],
  };
  