"use client";

import ProjectSearchFilterSection from "../ProjectSearchFilterSection";
import JoinedProjectsPage from "./JoinedProjectsPage";
import OwnerProjectsPage from "./OwnerProjectsPage";


const ProjectDashboard = () => {
  return (
    <div>
      <ProjectSearchFilterSection />
      <OwnerProjectsPage />
      <JoinedProjectsPage />
    </div>
  );
};

export default ProjectDashboard;