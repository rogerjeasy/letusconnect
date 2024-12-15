"use client"


import ProjectHeaderSection from "./ProjectHeaderSection"
import ProjectSearchFilterSection from "./ProjectSearchFilterSection";
import WhyExploreProjects from "./WhyExploreProjects";
import PublicProjectsPage from "./PubicProjects";

const ExploreProjects = () => {
  return (
    <div>
      <ProjectHeaderSection />
      <ProjectSearchFilterSection />
      <PublicProjectsPage />
      <WhyExploreProjects />
    </div>
  );
};
export default ExploreProjects;