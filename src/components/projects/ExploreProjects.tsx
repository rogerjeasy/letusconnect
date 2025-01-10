"use client"
import ProjectHeaderSection from "./ProjectHeaderSection"
import ProjectSearchFilterSection from "./ProjectSearchFilterSection";
import PublicProjectsPage from "./PubicProjects";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ExploreProjects = () => {
  const router = useRouter();
  return (
    <div>
      <ProjectHeaderSection />
      <ProjectSearchFilterSection />
      <PublicProjectsPage />
      <div className="flex justify-center mt-8 mb-8">
        <Button
          size="lg"
          color="success"
          onClick={() => router.push("/projects/why-projects")}
        >
          Why Projects ?
        </Button>
      </div>
    </div>
  );
};

export default ExploreProjects;