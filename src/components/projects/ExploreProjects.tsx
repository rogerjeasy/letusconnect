"use client"


import ProjectHeaderSection from "./ProjectHeaderSection"
import ProjectListingsSection from "./ProjectListingsSection";
import ProjectSearchFilterSection from "./ProjectSearchFilterSection";
import WhyExploreProjects from "./WhyExploreProjects";

const ExploreProjects = () => {
  return (
    <div>
      <ProjectHeaderSection />
      <ProjectSearchFilterSection />
      <ProjectListingsSection />
      <WhyExploreProjects />
    </div>
  );
};
export default ExploreProjects;